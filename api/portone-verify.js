// 포트원 V2 결제 검증 (서버 전용)
// - PORTONE_V2_SECRET 은 Vercel 환경변수에만 저장합니다. 코드·GitHub·브라우저에 절대 넣지 마세요.
// - 브라우저가 보낸 금액은 믿지 않고, 포트원에서 직접 조회한 값만 비교합니다.
const EXPECTED_AMOUNT = 14900;
const EXPECTED_ORDER_NAME = "기질 분석 리포트";

function send(res, status, body) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "허용되지 않는 요청입니다." });
  }

  const secret = process.env.PORTONE_V2_SECRET;
  if (!secret) {
    return send(res, 500, { ok: false, error: "서버 설정이 완료되지 않았습니다." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const paymentId = body && typeof body.paymentId === "string" ? body.paymentId : "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(paymentId)) {
    return send(res, 400, { ok: false, error: "주문번호 형식이 올바르지 않습니다." });
  }

  let payment;
  try {
    const r = await fetch("https://api.portone.io/payments/" + encodeURIComponent(paymentId), {
      method: "GET",
      headers: { Authorization: "PortOne " + secret }
    });
    if (!r.ok) {
      return send(res, 502, { ok: false, error: "결제 정보를 조회하지 못했습니다. (" + r.status + ")" });
    }
    payment = await r.json();
  } catch (e) {
    return send(res, 502, { ok: false, error: "결제 정보를 조회하지 못했습니다." });
  }

  if (payment.status !== "PAID") {
    return send(res, 402, { ok: false, error: "결제가 완료되지 않았습니다.", status: payment.status });
  }
  const total = payment.amount && payment.amount.total;
  if (total !== EXPECTED_AMOUNT) {
    return send(res, 409, { ok: false, error: "결제 금액이 일치하지 않습니다. 위변조가 의심되어 접수하지 않았습니다." });
  }
  if (payment.currency && payment.currency !== "KRW") {
    return send(res, 409, { ok: false, error: "결제 통화가 일치하지 않습니다." });
  }
  if (payment.orderName && payment.orderName !== EXPECTED_ORDER_NAME) {
    return send(res, 409, { ok: false, error: "주문 상품이 일치하지 않습니다." });
  }

  return send(res, 200, {
    ok: true,
    paymentId: paymentId,
    status: payment.status,
    amount: total,
    orderName: payment.orderName || EXPECTED_ORDER_NAME,
    paidAt: payment.paidAt || null
  });
};
