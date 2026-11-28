/* 포트원 V2 결제 (KG이니시스) — 재사용용 결제 모듈
   ▸ 실결제로 바꿀 때는 아래 CONFIG 두 줄(STORE_ID, CHANNEL_KEY)만 실연동 값으로 교체하세요.
   ▸ 시크릿(PORTONE_V2_SECRET)은 이 파일에 없습니다. Vercel 환경변수에만 있어요. */
window.MatPay = (function () {
  const CONFIG = {
    STORE_ID: "store-1c3884ea-ecca-4af3-9740-d684e2efd896",
    CHANNEL_KEY: "channel-key-76f315bd-a9a2-450b-b5a4-f538a3327d19",
    ORDER_NAME: "기질 분석 리포트",
    AMOUNT: 14900,
    VERIFY_URL: "/api/portone-verify"
  };

  function newPaymentId() {
    const rnd = Math.random().toString(36).slice(2, 10);
    return "mat-" + Date.now().toString(36) + "-" + rnd;
  }

  // 결제창 호출. 성공 시 { paymentId }, 취소·실패 시 throw
  async function pay(customer, redirectUrl) {
    if (!window.PortOne) throw new Error("결제 모듈을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    const paymentId = newPaymentId();
    const res = await window.PortOne.requestPayment({
      storeId: CONFIG.STORE_ID,
      channelKey: CONFIG.CHANNEL_KEY,
      paymentId: paymentId,
      orderName: CONFIG.ORDER_NAME,
      totalAmount: CONFIG.AMOUNT,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: { fullName: customer.name, email: customer.email, phoneNumber: customer.phone },
      redirectUrl: redirectUrl
    });
    if (res && res.code != null) throw new Error(res.message || "결제가 취소되었거나 실패했어요.");
    return { paymentId: paymentId };
  }

  // 서버 검증 (PAID + 14,900원 일치). order 를 함께 보내면 검증 통과 후 만세력 접수 목록에도 저장됩니다.
  // 같은 paymentId 로 다시 호출해도 접수는 한 번만 만들어져요.
  async function verify(paymentId, order) {
    const r = await fetch(CONFIG.VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: paymentId, order: order || undefined })
    });
    let data = {};
    try { data = await r.json(); } catch (e) {}
    if (!r.ok || !data.ok) {
      const e = new Error(data.error || "결제 검증에 실패했어요.");
      e.paid = !!data.paid; e.paymentId = paymentId;
      throw e;
    }
    return data;
  }

  return { CONFIG: CONFIG, pay: pay, verify: verify };
})();
