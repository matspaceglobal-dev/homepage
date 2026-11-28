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

  const result = {
    ok: true,
    paymentId: paymentId,
    status: payment.status,
    amount: total,
    orderName: payment.orderName || EXPECTED_ORDER_NAME,
    paidAt: payment.paidAt || null
  };

  // 결제가 확인된 신청 정보만 만세력 접수 목록으로 전달 (신청 정보가 없으면 결제 검증만 수행)
  const order = body && body.order && typeof body.order === "object" ? body.order : null;
  if (!order) return send(res, 200, result);

  const intakeUrl = process.env.INTAKE_URL;
  const intakeSecret = process.env.INTAKE_SECRET;
  if (!intakeUrl || !intakeSecret) {
    return send(res, 500, { ok: false, paid: true, paymentId: paymentId, error: "결제는 확인되었지만 접수 연결이 설정되지 않았습니다. 주문번호를 알려주세요." });
  }
  const payload = { paymentId: paymentId, amount: total };
  ["name", "email", "sex", "y", "m", "d", "h", "mi", "unk", "birthCity", "kind", "lang", "consent", "payer"].forEach(function (k) {
    if (order[k] !== undefined) payload[k] = order[k];
  });
  try {
    const ctl = new AbortController();
    const timer = setTimeout(function () { ctl.abort(); }, 15000);
    const r = await fetch(intakeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-secret": intakeSecret },
      body: JSON.stringify(payload),
      signal: ctl.signal
    });
    clearTimeout(timer);
    let d = {};
    try { d = await r.json(); } catch (e) {}
    if (!r.ok || !d.ok) {
      return send(res, 502, { ok: false, paid: true, paymentId: paymentId, error: "결제는 확인되었지만 접수 저장에 실패했습니다. 잠시 후 '접수 다시 시도'를 눌러 주세요. (주문번호 " + paymentId + ")" });
    }
    result.intake = { intakeId: d.intakeId, duplicate: !!d.duplicate };
    return send(res, 200, result);
  } catch (e) {
    return send(res, 502, { ok: false, paid: true, paymentId: paymentId, error: "결제는 확인되었지만 접수 저장에 실패했습니다. 잠시 후 '접수 다시 시도'를 눌러 주세요. (주문번호 " + paymentId + ")" });
  }
};
