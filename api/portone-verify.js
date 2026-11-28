// 포트원 V2 결제 검증 (서버 전용)
// - PORTONE_V2_SECRET 은 Vercel 환경변수에만 저장합니다. 코드·GitHub·브라우저에 절대 넣지 마세요.
// - 브라우저가 보낸 금액은 믿지 않고, 포트원에서 직접 조회한 값만 비교합니다.
const EXPECTED_AMOUNT = 14900;
const EXPECTED_ORDER_NAME = "기질 분석 리포트";

function send(res, status, body) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}

// 만세력 접수 함수(Saju diary 프로젝트)로 신청 정보를 전달
// 반환: { ok:true, intake:{intakeId,duplicate} } 또는 { ok:false, status, body }
async function sendToIntake(paymentId, amount, order, paid) {
  const intakeUrl = process.env.INTAKE_URL;
  const intakeSecret = process.env.INTAKE_SECRET;
  if (!intakeUrl || !intakeSecret) {
    return { ok: false, status: 500, body: { ok: false, paid: paid, paymentId: paymentId, error: "접수 연결이 설정되지 않았습니다." + (paid ? " 결제는 확인되었으니 주문번호를 알려주세요." : "") } };
  }
  const payload = { paymentId: paymentId, amount: amount };
  ["name", "email", "sex", "y", "m", "d", "h", "mi", "unk", "birthCity", "kind", "lang", "consent", "payer"].forEach(function (k) {
    if (order[k] !== undefined) payload[k] = order[k];
  });
  const failBody = { ok: false, paid: paid, paymentId: paymentId, error: paid
    ? "결제는 확인되었지만 접수 저장에 실패했습니다. 잠시 후 '접수 다시 시도'를 눌러 주세요. (주문번호 " + paymentId + ")"
    : "접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
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
    if (!r.ok || !d.ok) return { ok: false, status: 502, body: failBody };
    return { ok: true, intake: { intakeId: d.intakeId, duplicate: !!d.duplicate } };
  } catch (e) {
    return { ok: false, status: 502, body: failBody };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "허용되지 않는 요청입니다." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  // ── 테스트 접수 (결제 없이) ──
  // 서버 환경변수 INTAKE_TEST_MODE=1 일 때만 동작하고, 이름이 "테스트"로 시작하는 신청만 받습니다.
  // 실결제로 바꿀 때는 이 환경변수를 지우면 이 경로가 완전히 닫힙니다.
  if (body && body.testMode === true) {
    const o = body.order && typeof body.order === "object" ? body.order : null;
    if (process.env.INTAKE_TEST_MODE !== "1") {
      return send(res, 403, { ok: false, error: "테스트 접수가 꺼져 있습니다." });
    }
    if (!o || typeof o.name !== "string" || o.name.trim().indexOf("테스트") !== 0) {
      return send(res, 400, { ok: false, error: "테스트 접수는 이름이 '테스트'로 시작해야 합니다. (예: 테스트연결)" });
    }
    const testId = "test-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    const out = await sendToIntake(testId, EXPECTED_AMOUNT, o, false);
    if (!out.ok) return send(res, out.status, out.body);
    return send(res, 200, { ok: true, test: true, paymentId: testId, status: "TEST", amount: 0, orderName: EXPECTED_ORDER_NAME, paidAt: null, intake: out.intake });
  }

  const secret = process.env.PORTONE_V2_SECRET;
  if (!secret) {
    return send(res, 500, { ok: false, error: "서버 설정이 완료되지 않았습니다." });
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

  const out = await sendToIntake(paymentId, total, order, true);
  if (!out.ok) return send(res, out.status, out.body);
  result.intake = out.intake;
  return send(res, 200, result);
};
