/* 기본값 = 현재 운영 중인 9월 AI 네이티브 연구자 워크숍 사이트 내용.
   생성기(index.html)가 처음 열릴 때 이 값으로 폼을 채웁니다. */
var DEFAULT_PROGRAM = {
  site: {
    domain: "https://paiknamaiworkshop.vercel.app",
    name: "백남학술정보관 이용자 교육",
    org: "한양대학교 백남학술정보관",
    orgEn: "Hanyang University Paiknam Library & Academic Information Center",
    address: "서울특별시 성동구 왕십리로 222",
    team: "백남학술정보관 연구정보팀",
    phone: "02-2220-1372",
    email: "yujiney@hanyang.ac.kr",
    year: "2026"
  },
  images: {
    posterWide: "images/poster-wide.png",
    posterTall: "images/poster-tall.png",
    posterAlt: "Hanyang AI Native · AI 네이티브 연구자 워크숍",
    logoBlack: "images/logo-black.png",
    logoWhite: "images/logo-white.png",
    cardProgram: "images/card-program.jpg",
    cardEducation: "images/card-education.jpg",
    cardLineup: "images/card-lineup.jpg",
    cardApply: "images/card-apply.jpg",
    cardGoods: "images/goods-card.jpg"
  },
  home: {
    kicker: "Hanyang University · Paiknam Library & Academic Information Center",
    lead: "AI · 통계 · 논문작성까지\n2학기 동안 차근차근 배워요.",
    sub: "학부생 · 대학원생 · 교직원 누구나 참여할 수 있습니다. 강연 라인업과 굿즈도 함께 확인해 보세요.",
    hint: "위 카드를 눌러 자세한 내용을 확인하세요.",
    metaDesc: "9월~12월 매달 열리는 백남학술정보관 이용자 교육, 강사 라인업, 수료 굿즈 이벤트를 안내합니다."
  },
  program: {
    title: "AI 네이티브 연구자 워크숍",
    round: "1차 · 통계특강",
    status: "open",
    month: "9",
    heroDesc: "AI와 함께 연구의 경계를 넓히는 새로운 여정, 1차 통계특강을 소개합니다.",
    tagline: "AI와 함께 연구의 경계를 넓히는 새로운 여정",
    questions: [
      "이 통계분석, 제대로 하고 있는 걸까?",
      "결과표는 어떻게 작성해야 하지?",
      "AI를 연구에 어떻게 활용하면 좋을까?"
    ],
    paragraphs: [
      "논문을 쓰다 보면 한 번쯤 멈춰 서게 되는 질문들입니다. 이 워크숍은 그 지점만 골라 다룹니다.",
      "연구논문에 필요한 통계분석에서 시작해 가설 검증과 결과표 작성까지, AI와 SPSS를 직접 다루며 실습합니다. 연구의 처음부터 끝까지 이어서 배우는 자리입니다."
    ],
    venue: "백남학술정보관",
    venueSub: "6층 국제회의실",
    audience: "한양대 구성원",
    audienceSub: "재학생 · 대학원생 · 교직원",
    fee: "무료",
    feeSub: "선착순 마감"
  },
  education: {
    heroDesc: "9월 워크숍의 회차별 내용과 일시, 장소를 정리했습니다.",
    sectionTitle: "이번 학기 교육",
    intro: "연구주제를 세우는 일부터 지도교수님이 원하는 결과표를 만드는 일까지, 이틀에 걸쳐 이어서 다룹니다. SPSS와 무료 통계 프로그램, 생성형 AI를 함께 씁니다. 두 회차는 내용이 이어지므로 함께 들으시길 권합니다.",
    showLocked: true,
    sessions: [
      {
        no: "1회차", date: "09.21", dow: "월요일", time: "12:00 – 16:00", status: "open",
        title: "연구논문 가설 검증을 위한 통계분석과 연구방법론 이해 및 AI 활용",
        lead: "연구주제를 설계하고, 논문에서 쓰이는 변수와 연구방법론을 정리한 뒤 데이터를 직접 다뤄 봅니다.",
        items: [
          "통계분석과 AI를 활용한 연구주제 설계",
          "논문에서 자주 쓰이는 주요 변수의 종류와 연구방법론 이해",
          "AI와 SPSS 통계 프로그램을 활용한 데이터 핸들링과 활용 실습"
        ]
      },
      {
        no: "2회차", date: "09.22", dow: "화요일", time: "12:00 – 16:00", status: "open",
        title: "SPSS와 무료 통계프로그램 활용을 통한 내 연구 가설 검증과 결과표 작성 방법",
        lead: "분석을 돌려 가설을 검증하고, 그 결과를 논문에 옮겨 적는 방법까지 다룹니다.",
        items: [
          "주요 통계분석 방법을 적용한 가설 검증",
          "무료 통계 프로그램과 생성형 AI를 활용한 결과 작성",
          "통계 결과를 활용한 서론 · 이론적 배경 작성 방법",
          "지도교수님이 원하는 논문 결과표 작성 방법"
        ]
      }
    ]
  },
  lineup: {
    heroDesc: "9월 워크숍을 이끄는 강연자와 회차별 일정을 안내합니다.",
    lockedCount: 2,
    notice: "장소와 정원은 사정에 따라 조정될 수 있습니다."
  },
  lecturer: {
    show: true,
    sectionTitle: "1 · 2회차 강연자",
    org: "히든그레이스",
    name: "김성은",
    title: "대표",
    logo: "images/hg-logo.png",
    lead: "논문 통계 컨설팅과 데이터 분석을 함께 다뤄 온 실무자입니다. 연구 설계부터 결과표 작성까지, 학위논문에서 실제로 막히는 지점을 중심으로 강의합니다.",
    careers: [
      { text: "주식회사 라잇 대표", note: "2021 ~ 현재" },
      { text: "주식회사 히든그레이스 대표", note: "2013 ~ 현재" },
      { text: "데이터분석 · 머신러닝 프로젝트 500건 진행", note: "" },
      { text: "논문 컨설팅 · 상담 약 30,000건 진행", note: "" }
    ],
    books: [
      { text: "『한번에 통과하는 논문』 시리즈", note: "전 3권" },
      { text: "『한번에 적용하는 분석』", note: "" },
      { text: "『한번에 적용하는 의료보건통계』 시리즈", note: "전 3권" }
    ],
    projects: [
      "SK그룹 가치소비자 예측 및 타겟팅 분석",
      "현대자동차 HR Analytics",
      "현대모비스 조직문화진단",
      "한국수목원정원관리원 지역상생사업 성과 평가",
      "충청남도 정부서비스 만족도조사",
      "한국데이터베이스진흥원 데이터거래 수요조사",
      "서울시 정신건강증진센터 분석보고서"
    ]
  },
  apply: {
    hylu: "https://hylu-s.hanyang.ac.kr/ko/program/all/view/2757",
    heroDesc: "한양대 비교과 통합관리 시스템(HY-LU)에서 신청하시면 됩니다.",
    note: "9월 AI 네이티브 연구자 워크숍(1 · 2회차) 접수가 열려 있습니다. 10월 이후 교육은 확정되는 대로 공개합니다.",
    step3: ""
  },
  goods: {
    heroDesc: "워크숍에 참여하시면 굿즈를 받을 수 있습니다.",
    headline: "워크숍 1회 이상 참여하고\n만족도 조사를 완료한 30명에게 굿즈를 드립니다",
    items: [
      { img: "images/goods-01.jpg", name: "맥세이프 카드지갑", cond: "워크숍(1차) + 만족도 조사 참여",
        desc: "휴대폰 뒷면에 자석으로 붙이는 투명 카드지갑입니다. 학생증과 교통카드가 함께 들어갑니다. 청춘 · 사랑 · 자유 3종 중 택 1." },
      { img: "images/goods-02.jpg", name: "미니 북키링", cond: "워크숍(1차) + 만족도 조사 참여",
        desc: "가방이나 열쇠에 걸어 두는 미니 북 키링입니다. 꿈 · 낭만 · 행복 3종 중 택 1." },
      { img: "images/goods-03.jpg", name: "떡메모지", cond: "워크숍(1차) + 만족도 조사 참여",
        desc: "한 장씩 뜯어 쓰는 100매 메모지입니다. 인용 메모나 할 일 정리에 쓰기 좋은 크기입니다. 4종 중 택 1." },
      { img: "images/goods-04.jpg", name: "[협찬] 『신경 끄기의 기술』", cond: "워크숍(1차) + 만족도 조사 참여",
        desc: "마크 맨슨 지음 · 한재호 옮김. 중요한 것에만 힘을 쏟는 법을 다룬 책입니다. 50만부 기념 한교동 에디션을 드립니다." }
    ]
  }
};
if (typeof module !== "undefined") module.exports = DEFAULT_PROGRAM;
