[오늘 내 상태 확인하기] 홈페이지 추가 방법

1) 이 "today" 폴더를 통째로 홈페이지 깃허브 저장소에 넣으세요.
   - 저장소에 "public" 폴더가 있으면  → public 안에 넣기 (public/today/...)
   - "public" 폴더가 없으면          → 저장소 맨 위(첫 화면)에 넣기 (today/...)

2) 홈페이지 메뉴에 아래 링크를 추가하세요.
   <a href="/today/index.html">오늘 내 상태 확인하기</a>

3) 커밋/푸시하면 배포 후 아래 주소에서 열립니다.
   https://www.matspaceglobal.com/today/index.html

* 인스타 DM용 바로가기: 주소 끝에 ?ilju=일주 를 붙이면 그 일주가 바로 열립니다.
  예) https://www.matspaceglobal.com/today/index.html?ilju=병인
* 주소/문구 수정: index.html 안의 CONFIG(링크), MEANING(십성 풀이)
* 운세 한 줄 수정: lines.js
* PC 설치파일 링크가 생기면 CONFIG의 PC_DOWNLOAD_URL에 넣으면 버튼이 나타납니다.
