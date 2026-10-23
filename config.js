/* =========================================================
   ✏️ 이 파일만 수정하면 돼요!
   - 따옴표("") 안의 내용만 바꾸고, 따옴표는 지우지 마세요.
   ========================================================= */
window.MATSPACE_CONFIG = {
  // 1) Supabase → Project Settings → API Keys 에서 복사 (공고 관리자 로그인용)
  supabaseUrl: "여기에_Project_URL_붙여넣기",
  supabaseAnonKey: "여기에_anon_public_key_붙여넣기",

  // 2) 관리자 이메일 (이 이메일로 로그인할 때만 공고 등록/수정/삭제 가능)
  adminEmail: "matspaceglobal@gmail.com",

  // 3) 링크
  appStoreUrl: "https://apps.apple.com/kr/app/%EC%82%AC%EC%A3%BC%EC%9D%BC%EA%B8%B0-%EA%B8%B0%EB%A1%9D%ED%95%A0%EC%88%98%EB%A1%9D-%EC%A0%95%ED%99%95%ED%95%B4%EC%A7%80%EB%8A%94-%EC%9A%B4%EC%84%B8/id6800301249",
  instagramUrl: "https://www.instagram.com/matspace.official/",
  email: "matspaceglobal@gmail.com",

  // 4) 서비스 메뉴 (서비스 ▾ 아래 목록) · name = 한국어, nameEn = 영어
  //    새 서비스 페이지를 만들면 여기에 한 줄 추가하면 메뉴에 자동으로 나타나요.
  services: [
    { name: "사주일기", nameEn: "Saju Diary", path: "service/saju-diary/" }
  ]
};
