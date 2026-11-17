/**
 * LunchRecommender Interactive Web App
 * Based on C++ LunchRecommender (main.cpp, LunchRecommender.cpp, LunchRecommender.h)
 */

// 1. C++ 원본 데이터베이스 복제 (16종씩 총 64개)
const DEFAULT_MENU_DATA = {
  1: {
    name: "한식",
    emoji: "🍚",
    color: "#ff5722",
    items: [
      "김치찌개", "된장찌개", "제육볶음", "비빔밥", "떡볶이",
      "삼겹살", "갈비탕", "순두부찌개", "부대찌개", "감자탕",
      "김치찜", "설렁탕", "칼국수", "곱창", "김밥", "찜닭"
    ]
  },
  2: {
    name: "중식",
    emoji: "🥟",
    color: "#d32f2f",
    items: [
      "짜장면", "짬뽕", "볶음밥", "마라탕", "탕수육",
      "마파두부", "깐풍기", "양꼬치", "딤섬", "훠궈",
      "동파육", "마라샹궈", "멘보샤", "크림새우", "짬뽕밥", "우육면"
    ]
  },
  3: {
    name: "일식",
    emoji: "🍣",
    color: "#0288d1",
    items: [
      "초밥", "라멘", "돈까스", "가츠동", "우동",
      "메밀소바", "규동", "사케동", "야키소바", "타코야끼",
      "오꼬노미야끼", "장어덮밥", "텐동", "샤브샤브", "카레라이스", "가라아게"
    ]
  },
  4: {
    name: "양식",
    emoji: "🍕",
    color: "#7b1fa2",
    items: [
      "토마토 파스타", "알리오 올리오", "페퍼로니 피자", "수제버거", "스테이크",
      "크림 리조또", "감바스", "에그인헬", "라자냐", "리코타 샐러드",
      "바베큐립", "뇨끼", "로제 파스타", "감바스", "투움바 파스타", "클램 차우더"
    ]
  }
};

// 메뉴별 매칭 이모지 & 추천 멘트 사전
const MENU_META = {
  // 한식
  "김치찌개": { emoji: "🥘", desc: "칼칼하고 진한 김치 국물로 속을 든든하게 채우세요!" },
  "된장찌개": { emoji: "🍲", desc: "구수한 된장과 두부의 환상 조합, 집밥의 따스함!" },
  "제육볶음": { emoji: "🥩", desc: "매콤달콤 불맛 나는 영원한 점심 밥도둑 1위!" },
  "비빔밥": { emoji: "🥗", desc: "다채로운 나물과 고추장의 조화, 건강하고 깔끔한 한 끼!" },
  "떡볶이": { emoji: "🍢", desc: "매콤달달 쫄깃함의 대명사, 분식 땡기는 날엔 무조건!" },
  "삼겹살": { emoji: "🥓", desc: "지글지글 갓 구운 고기로 든든하게 기력 보충!" },
  "갈비탕": { emoji: "🍖", desc: "깊고 진한 고기 육수로 보양하는 맑고 든든한 국물!" },
  "순두부찌개": { emoji: "🍲", desc: "부드러운 순두부에 칼칼한 고추기름, 계란 톡!" },
  "부대찌개": { emoji: "🥘", desc: "햄과 소시지, 라면 사리까지 푸짐하게 즐기는 행복!" },
  "감자탕": { emoji: "🍖", desc: "들깨가루 듬뿍, 뼈 발라먹는 재미와 진한 국물!" },
  "김치찜": { emoji: "🥓", desc: "푹 익은 묵은지와 돼지고기의 부드러운 만남!" },
  "설렁탕": { emoji: "🥣", desc: "뽀얗고 진한 사골 국물에 소면과 깍두기 한 점!" },
  "칼국수": { emoji: "🍜", desc: "쫄깃한 손면발에 시원한 바지락/사골 국물 호로록!" },
  "곱창": { emoji: "🔥", desc: "쫄깃하고 고소한 기름짐으로 스트레스 한 방에 격파!" },
  "김밥": { emoji: "🍙", desc: "간편하지만 꽉 찬 영양, 라면과 곁들이면 환상!" },
  "찜닭": { emoji: "🍗", desc: "단짠단짠 간장 양념에 당면 호로록, 밥 비벼먹기 최고!" },

  // 중식
  "짜장면": { emoji: "🥢", desc: "달콤짭조름한 춘장의 영원한 국민 점심 메뉴!" },
  "짬뽕": { emoji: "🍜", desc: "얼큰하고 불맛 가득한 해물 국물로 땀 쏙 빼는 날!" },
  "볶음밥": { emoji: "🍳", desc: "고슬고슬 볶아낸 밥에 짜장 소스와 짬뽕 국물 세트!" },
  "마라탕": { emoji: "🌶️", desc: "얼얼하고 중독적인 마라의 맛, 내가 원하는 재료 듬뿍!" },
  "탕수육": { emoji: "🥢", desc: "바삭바삭 튀김옷에 새콤달콤 소스, 부먹이든 찍먹이든!" },
  "마파두부": { emoji: "🍛", desc: "부드러운 두부와 매콤한 두반장 소스로 밥 한 공기 뚝딱!" },
  "깐풍기": { emoji: "🍗", desc: "매콤달콤 바삭하게 볶아낸 중화풍 닭요리의 진수!" },
  "양꼬치": { emoji: "🍢", desc: "쯔란 가루 콕 찍어먹는 고소하고 풍미 가득한 맛!" },
  "딤섬": { emoji: "🥟", desc: "육즙이 팡 터지는 소롱포와 탱글탱글한 새우 쇼마이!" },
  "훠궈": { emoji: "🍲", desc: "홍탕과 백탕을 넘나드는 푸짐하고 화려한 중식 샤브!" },
  "동파육": { emoji: "🥩", desc: "입안에서 사르르 녹는 부드러운 오향 삼겹살의 미학!" },
  "마라샹궈": { emoji: "🥘", desc: "얼얼하게 볶아낸 중독성 최강의 밥도둑 볶음 요리!" },
  "멘보샤": { emoji: "🍤", desc: "바삭한 식빵 사이에 통통한 새우살이 꽉!" },
  "크림새우": { emoji: "🍤", desc: "달콤상큼 부드러운 레몬 크림소스와 바삭한 새우 튀김!" },
  "짬뽕밥": { emoji: "🍚", desc: "얼큰한 짬뽕 국물에 당면과 밥 말아서 든든하게!" },
  "우육면": { emoji: "🍜", desc: "진하고 이국적인 향신료와 부드러운 소고기가 듬뿍!" },

  // 일식
  "초밥": { emoji: "🍣", desc: "신선한 해산물과 밥알의 깔끔하고 고급스러운 한 끼!" },
  "라멘": { emoji: "🍜", desc: "진한 돈코츠 육수에 차슈와 반숙란을 곁들인 힐링 푸드!" },
  "돈까스": { emoji: "🍱", desc: "겉바속촉 두툼한 안심/등심 카츠, 소스 콕 찍어서!" },
  "가츠동": { emoji: "🍲", desc: "달콤짭조름한 소스에 촉촉한 돈까스와 계란 덮밥!" },
  "우동": { emoji: "🍜", desc: "통통하고 쫄깃한 면발과 깔끔하고 따스한 가쓰오 국물!" },
  "메밀소바": { emoji: "🥢", desc: "살얼음 동동 쯔유에 고추냉이 풀고 시원하게 적셔먹기!" },
  "규동": { emoji: "🍚", desc: "달착지근하게 졸인 소고기와 양파를 얹은 초간편 덮밥!" },
  "사케동": { emoji: "🐟", desc: "주황빛 고소한 연어와 생와사비의 살살 녹는 환상 조합!" },
  "야키소바": { emoji: "🍝", desc: "철판에서 가쓰오부시 춤추는 단짠 볶음 우동면!" },
  "타코야끼": { emoji: "🐙", desc: "동글동글 문어가 씹히는 간편하고 맛있는 간식 겸 식사!" },
  "오꼬노미야끼": { emoji: "🥞", desc: "풍성한 양배추와 해물, 마요네즈가 어우러진 일본식 전!" },
  "장어덮밥": { emoji: "🍱", desc: "달콤한 특제 타레 소스를 발라 구운 럭셔리 보양식!" },
  "텐동": { emoji: "🍤", desc: "바삭한 모둠 튀김에 짭짤한 간장 소스를 곁들인 튀김 덮밥!" },
  "샤브샤브": { emoji: "🍲", desc: "맑은 육수에 신선한 야채와 얇은 소고기를 살랑살랑!" },
  "카레라이스": { emoji: "🍛", desc: "오랜 시간 푹 끓여 깊고 진한 일본식 정통 카레!" },
  "가라아게": { emoji: "🍗", desc: "짭조름하고 육즙 가득한 닭다리살 튀김, 겉바속촉!" },

  // 양식
  "토마토 파스타": { emoji: "🍝", desc: "상큼한 토마토 소스와 허브 향이 감도는 클래식 파스타!" },
  "알리오 올리오": { emoji: "🧄", desc: "마늘과 올리브 오일, 페페론치노의 깔끔하고 깊은 풍미!" },
  "페퍼로니 피자": { emoji: "🍕", desc: "짭조름한 페퍼로니와 쭉쭉 늘어나는 고소한 모짜렐라 치즈!" },
  "수제버거": { emoji: "🍔", desc: "육즙 폭발하는 두툼한 패티와 신선한 야채의 하모니!" },
  "스테이크": { emoji: "🥩", desc: "완벽하게 구워낸 육즙 가득한 고기로 기분 내는 날!" },
  "크림 리조또": { emoji: "🍚", desc: "녹진하고 부드러운 생크림과 버섯이 어우러진 이탈리안 쌀요리!" },
  "감바스": { emoji: "🍤", desc: "올리브유에 마늘과 통새우 지글지글, 바게트 빵 찍먹!" },
  "에그인헬": { emoji: "🍳", desc: "매콤한 토마토소스에 계란을 퐁당, 샥슈카의 매력!" },
  "라자냐": { emoji: "🧀", desc: "넓적한 파스타면 사이로 라구소스와 치즈가 겹겹이!" },
  "리코타 샐러드": { emoji: "🥗", desc: "신선한 야채에 부드러운 리코타 치즈와 발사믹 드레싱!" },
  "바베큐립": { emoji: "🍖", desc: "달콤짭짤 스모키 바베큐 소스가 스며든 뼈고기 뜯기!" },
  "뇨끼": { emoji: "🥔", desc: "쫄깃하고 쫀득한 감자 반죽에 트러플 크림소스 듬뿍!" },
  "로제 파스타": { emoji: "🍝", desc: "부드러운 크림과 상큼한 토마토의 완벽한 밸런스!" },
  "투움바 파스타": { emoji: "🍤", desc: "매콤하면서도 진한 크림소스와 큼직한 새우의 만남!" },
  "클램 차우더": { emoji: "🥣", desc: "조개살과 감자가 듬뿍 들어간 따스하고 걸쭉한 크림 수프!" }
};

// C++ 소스코드 원본 텍스트 (뷰어용)
const CPP_SOURCES = {
  main: `#include <iostream>
#include <cstdlib>
#include <ctime>
#include "LunchRecommender.h"

using namespace std;

int main() {
    // 난수 생성기 초기화
    srand(static_cast<unsigned int>(time(0)));

    LunchRecommender recommender;
    int choice = 0;

    cout << "====================================\\n";
    cout << "   [오늘 뭐 먹지? 점심 메뉴 추천기]   \\n";
    cout << "====================================\\n\\n";
    cout << "원하는 음식 카테고리를 선택하세요:\\n";
    cout << "1. 한식 (16종)\\n2. 중식 (16종)\\n3. 일식 (16종)\\n4. 양식 (16종)\\n";
    cout << "숫자 입력 (1~4): ";
    cin >> choice;

    string resultMenu = recommender.getRandomMenu(choice);

    cout << "\\n------------------------------------\\n";
    if (resultMenu != "") {
        cout << "[" << recommender.getCategoryName(choice) << "] 추천 메뉴: "
            << resultMenu << "\\n";
        cout << "맛있게 드세요!\\n";
    }
    else {
        cout << "올바르지 않은 번호입니다. 1~4 사이의 숫자를 입력해 주세요.\\n";
    }
    cout << "====================================\\n";

    return 0;
}`,

  cpp: `#include "LunchRecommender.h"
#include <cstdlib>

using namespace std;

// 생성자: 메뉴 데이터 초기화
LunchRecommender::LunchRecommender() {
    koreanMenu = {
        "김치찌개", "된장찌개", "제육볶음", "비빔밥", "떡볶이",
        "삼겹살", "갈비탕", "순두부찌개", "부대찌개", "감자탕",
        "김치찜", "설렁탕", "칼국수", "곱창", "김밥", "찜닭"
    };
    chineseMenu = {
        "짜장면", "짬뽕", "볶음밥", "마라탕", "탕수육",
        "마파두부", "깐풍기", "양꼬치", "딤섬", "훠궈",
        "동파육", "마라샹궈", "멘보샤", "크림새우", "짬뽕밥", "우육면"
    };
    japaneseMenu = {
        "초밥", "라멘", "돈까스", "가츠동", "우동",
        "메밀소바", "규동", "사케동", "야키소바", "타코야끼",
        "오꼬노미야끼", "장어덮밥", "텐동", "샤브샤브", "카레라이스", "가라아게"
    };
    westernMenu = {
        "토마토 파스타", "알리오 올리오", "페퍼로니 피자", "수제버거", "스테이크",
        "크림 리조또", "감바스", "에그인헬", "라자냐", "리코타 샐러드",
        "바베큐립", "뇨끼", "로제 파스타", "감바스", "투움바 파스타", "클램 차우더"
    };
}

// 카테고리별 랜덤 메뉴 반환 함수 정의
string LunchRecommender::getRandomMenu(int category) const {
    const vector<string>* selectedList = nullptr;

    switch (category) {
    case 1: selectedList = &koreanMenu; break;
    case 2: selectedList = &chineseMenu; break;
    case 3: selectedList = &japaneseMenu; break;
    case 4: selectedList = &westernMenu; break;
    default: return "";
    }

    int randomIndex = rand() % selectedList->size();
    return (*selectedList)[randomIndex];
}

// 카테고리 이름 반환 함수 정의
string LunchRecommender::getCategoryName(int category) const {
    switch (category) {
    case 1: return "한식";
    case 2: return "중식";
    case 3: return "일식";
    case 4: return "양식";
    default: return "알 수 없음";
    }
}`,

  h: `#pragma once

#include <string>
#include <vector>

class LunchRecommender {
private:
    // 카테고리별 메뉴 목록 변수 선언
    std::vector<std::string> koreanMenu;
    std::vector<std::string> chineseMenu;
    std::vector<std::string> japaneseMenu;
    std::vector<std::string> westernMenu;

public:
    // 생성자
    LunchRecommender();

    // 멤버 함수 선언
    std::string getRandomMenu(int category) const;
    std::string getCategoryName(int category) const;
};`
};

/* ==========================================================================
   2. Web Audio API 사운드 신시사이저 (외부 음원 종속성 없음)
   ========================================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // AudioContext 정책 예외 방지
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.09;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) { }
  }
}

/* ==========================================================================
   3. Confetti (꽃가루 폭죽 애니메이션)
   ========================================================================== */
class ConfettiEffect {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 60) {
    const colors = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#da77f2"];
    const startX = this.canvas.width / 2;
    const startY = this.canvas.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 6 + Math.random() * 9;
      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0.98
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // 중력
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.opacity *= p.life;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.opacity < 0.05 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

/* ==========================================================================
   4. C++ LunchRecommender 모델을 브라우저에 매핑한 클래스
   ========================================================================== */
class LunchRecommenderApp {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = new ConfettiEffect(document.getElementById("confettiCanvas"));

    this.currentCategory = 0; // 0: 전체, 1: 한식, 2: 중식, 3: 일식, 4: 양식
    this.currentTab = "all";
    this.isRolling = false;
    this.history = [];

    // LocalStorage에서 커스텀 메뉴 데이터 및 설정 로드
    this.menuData = this.loadMenuData();
    this.history = this.loadHistory();

    this.initDOM();
    this.bindEvents();
    this.applyTheme(this.loadTheme());
    this.updateStats();
    this.renderMenuGrid();
    this.renderHistory();
    this.loadCodeTab("main");
  }

  loadMenuData() {
    const saved = localStorage.getItem("lunch_menu_data_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("데이터 복원 실패, 기본값 로드", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
  }

  saveMenuData() {
    localStorage.setItem("lunch_menu_data_v1", JSON.stringify(this.menuData));
    this.updateStats();
  }

  loadHistory() {
    const saved = localStorage.getItem("lunch_history_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return [];
  }

  saveHistory() {
    localStorage.setItem("lunch_history_v1", JSON.stringify(this.history));
  }

  loadTheme() {
    return localStorage.getItem("lunch_theme") || "light";
  }

  saveTheme(theme) {
    localStorage.setItem("lunch_theme", theme);
  }

  // C++의 getRandomMenu(category) & getCategoryName(category) 구현
  getRandomMenu(category) {
    let pool = [];
    let selectedCat = category;

    if (category === 0) {
      // 전체 랜덤: 1~4번 모든 카테고리 병합
      const allItems = [];
      Object.keys(this.menuData).forEach((catId) => {
        this.menuData[catId].items.forEach((item) => {
          allItems.push({ name: item, catId: Number(catId) });
        });
      });
      if (allItems.length === 0) return null;
      const pick = allItems[Math.floor(Math.random() * allItems.length)];
      return { menu: pick.name, catId: pick.catId, catName: this.getCategoryName(pick.catId) };
    }

    if (this.menuData[category] && this.menuData[category].items.length > 0) {
      const items = this.menuData[category].items;
      const randomIndex = Math.floor(Math.random() * items.length);
      return {
        menu: items[randomIndex],
        catId: category,
        catName: this.getCategoryName(category)
      };
    }

    return null;
  }

  getCategoryName(category) {
    switch (category) {
      case 1: return "한식";
      case 2: return "중식";
      case 3: return "일식";
      case 4: return "양식";
      default: return "알 수 없음";
    }
  }

  getMenuEmoji(menuName) {
    if (MENU_META[menuName] && MENU_META[menuName].emoji) {
      return MENU_META[menuName].emoji;
    }
    return "🍱";
  }

  getMenuDesc(menuName) {
    if (MENU_META[menuName] && MENU_META[menuName].desc) {
      return MENU_META[menuName].desc;
    }
    return "맛있고 든든한 점심 식사로 활기찬 하루를 보내세요!";
  }

  /* ==========================================================================
     DOM 참조 초기화
     ========================================================================== */
  initDOM() {
    this.dom = {
      themeToggleBtn: document.getElementById("themeToggleBtn"),
      themeIcon: document.getElementById("themeIcon"),
      soundToggleBtn: document.getElementById("soundToggleBtn"),
      soundIcon: document.getElementById("soundIcon"),
      categoryCards: document.querySelectorAll(".category-card"),
      currentCategoryText: document.getElementById("currentCategoryText"),
      slotWindow: document.getElementById("slotWindow"),
      slotRoller: document.getElementById("slotRoller"),
      resultBox: document.getElementById("resultBox"),
      resultCategoryBadge: document.getElementById("resultCategoryBadge"),
      resultFoodName: document.getElementById("resultFoodName"),
      resultDesc: document.getElementById("resultDesc"),
      naverMapLink: document.getElementById("naverMapLink"),
      kakaoMapLink: document.getElementById("kakaoMapLink"),
      recommendBtn: document.getElementById("recommendBtn"),
      reRollBtn: document.getElementById("reRollBtn"),
      menuChipGrid: document.getElementById("menuChipGrid"),
      filterTabs: document.querySelectorAll(".tab-btn"),
      menuSearchInput: document.getElementById("menuSearchInput"),
      clearSearchBtn: document.getElementById("clearSearchBtn"),
      openAddModalBtn: document.getElementById("openAddModalBtn"),
      addModalBackdrop: document.getElementById("addModalBackdrop"),
      closeAddModalBtn: document.getElementById("closeAddModalBtn"),
      cancelAddModalBtn: document.getElementById("cancelAddModalBtn"),
      addMenuForm: document.getElementById("addMenuForm"),
      newCategorySelect: document.getElementById("newCategorySelect"),
      newMenuName: document.getElementById("newMenuName"),
      resetMenuBtn: document.getElementById("resetMenuBtn"),
      historyList: document.getElementById("historyList"),
      clearHistoryBtn: document.getElementById("clearHistoryBtn"),
      codeTabs: document.querySelectorAll(".code-tab"),
      codeSnippet: document.getElementById("codeSnippet"),
      totalMenuCount: document.getElementById("totalMenuCount"),
      countAll: document.getElementById("count-all"),
      count1: document.getElementById("count-1"),
      count2: document.getElementById("count-2"),
      count3: document.getElementById("count-3"),
      count4: document.getElementById("count-4"),
      tabCountAll: document.getElementById("tabCountAll"),
      tabCount1: document.getElementById("tabCount1"),
      tabCount2: document.getElementById("tabCount2"),
      tabCount3: document.getElementById("tabCount3"),
      tabCount4: document.getElementById("tabCount4")
    };
  }

  /* ==========================================================================
     이벤트 리스너 바인딩
     ========================================================================== */
  bindEvents() {
    // 1. 테마 토글
    this.dom.themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      this.applyTheme(next);
      this.saveTheme(next);
    });

    // 2. 사운드 토글
    this.dom.soundToggleBtn.addEventListener("click", () => {
      this.sound.enabled = !this.sound.enabled;
      this.dom.soundIcon.textContent = this.sound.enabled ? "🔊" : "🔇";
      this.dom.soundToggleBtn.title = this.sound.enabled ? "효과음 켜짐" : "효과음 꺼짐";
    });

    // 3. 카테고리 카드 클릭
    this.dom.categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        if (this.isRolling) return;
        const cat = Number(card.dataset.category);
        this.selectCategory(cat);
      });
    });

    // 4. 추천 버튼 & 다시 추천 버튼
    this.dom.recommendBtn.addEventListener("click", () => this.startRolling());
    this.dom.reRollBtn.addEventListener("click", () => this.startRolling());

    // 5. 메뉴 탐색기 탭 클릭
    this.dom.filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.dom.filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.currentTab = tab.dataset.tab;
        this.renderMenuGrid();
      });
    });

    // 6. 메뉴 검색 입력
    this.dom.menuSearchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val.length > 0) {
        this.dom.clearSearchBtn.classList.remove("hidden");
      } else {
        this.dom.clearSearchBtn.classList.add("hidden");
      }
      this.renderMenuGrid();
    });

    this.dom.clearSearchBtn.addEventListener("click", () => {
      this.dom.menuSearchInput.value = "";
      this.dom.clearSearchBtn.classList.add("hidden");
      this.renderMenuGrid();
    });

    // 7. 모달 열기/닫기
    this.dom.openAddModalBtn.addEventListener("click", () => {
      this.dom.addModalBackdrop.classList.remove("hidden");
      this.dom.newMenuName.focus();
    });

    const closeModal = () => {
      this.dom.addModalBackdrop.classList.add("hidden");
      this.dom.addMenuForm.reset();
    };

    this.dom.closeAddModalBtn.addEventListener("click", closeModal);
    this.dom.cancelAddModalBtn.addEventListener("click", closeModal);
    this.dom.addModalBackdrop.addEventListener("click", (e) => {
      if (e.target === this.dom.addModalBackdrop) closeModal();
    });

    // 8. 메뉴 추가 폼 제출
    this.dom.addMenuForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const catId = Number(this.dom.newCategorySelect.value);
      const menuName = this.dom.newMenuName.value.trim();

      if (!menuName) return;

      if (!this.menuData[catId].items.includes(menuName)) {
        this.menuData[catId].items.unshift(menuName);
        this.saveMenuData();
        this.renderMenuGrid();
        closeModal();
      } else {
        alert("이미 존재하는 메뉴입니다!");
      }
    });

    // 9. 초기화 버튼
    this.dom.resetMenuBtn.addEventListener("click", () => {
      if (confirm("초기 C++ 원본 데이터(각 카테고리 16종)로 되돌리시겠습니까?")) {
        this.menuData = JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
        this.saveMenuData();
        this.renderMenuGrid();
        alert("초기 데이터로 복원되었습니다.");
      }
    });

    // 10. 기록 지우기
    this.dom.clearHistoryBtn.addEventListener("click", () => {
      if (confirm("추천 기록을 모두 지우시겠습니까?")) {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
      }
    });

    // 11. C++ 코드 탭 클릭
    this.dom.codeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.dom.codeTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.loadCodeTab(tab.dataset.code);
      });
    });
  }

  /* ==========================================================================
     테마 적용
     ========================================================================== */
  applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      this.dom.themeIcon.textContent = "☀️";
      this.dom.themeToggleBtn.title = "라이트 모드로 전환";
    } else {
      document.documentElement.removeAttribute("data-theme");
      this.dom.themeIcon.textContent = "🌙";
      this.dom.themeToggleBtn.title = "다크 모드로 전환";
    }
  }

  /* ==========================================================================
     카테고리 선택 처리
     ========================================================================== */
  selectCategory(catId) {
    this.currentCategory = catId;
    this.dom.categoryCards.forEach((c) => {
      const match = Number(c.dataset.category) === catId;
      c.classList.toggle("active", match);
      c.setAttribute("aria-checked", match ? "true" : "false");
    });

    const catNames = { 0: "전체 랜덤 (64종 대상)", 1: "한식 (16종)", 2: "중식 (16종)", 3: "일식 (16종)", 4: "양식 (16종)" };
    const count = catId === 0 ? this.getTotalCount() : (this.menuData[catId]?.items.length || 0);
    this.dom.currentCategoryText.textContent = `선택: ${catNames[catId] || "전체"} (${count}종 대상)`;
  }

  getTotalCount() {
    return Object.values(this.menuData).reduce((sum, c) => sum + c.items.length, 0);
  }

  updateStats() {
    const total = this.getTotalCount();
    this.dom.totalMenuCount.textContent = `총 ${total}종 메뉴`;
    this.dom.countAll.textContent = `${total}종`;
    this.dom.tabCountAll.textContent = total;

    for (let i = 1; i <= 4; i++) {
      const count = this.menuData[i]?.items.length || 0;
      if (this.dom[`count${i}`]) this.dom[`count${i}`].textContent = `${count}종`;
      if (this.dom[`tabCount${i}`]) this.dom[`tabCount${i}`].textContent = count;
    }
  }

  /* ==========================================================================
     슬롯머신 룰렛 롤링 애니메이션 & 추천
     ========================================================================== */
  startRolling() {
    if (this.isRolling) return;

    // 후보 목록 확인
    let candidates = [];
    if (this.currentCategory === 0) {
      Object.keys(this.menuData).forEach((catId) => {
        this.menuData[catId].items.forEach((item) => {
          candidates.push({ name: item, catId: Number(catId) });
        });
      });
    } else if (this.menuData[this.currentCategory]) {
      this.menuData[this.currentCategory].items.forEach((item) => {
        candidates.push({ name: item, catId: this.currentCategory });
      });
    }

    if (candidates.length === 0) {
      alert("추천할 메뉴가 없습니다. 메뉴를 추가해 주세요!");
      return;
    }

    // 최종 당첨 메뉴 미리 결정
    const finalPick = candidates[Math.floor(Math.random() * candidates.length)];

    this.isRolling = true;
    this.dom.recommendBtn.disabled = true;
    this.dom.reRollBtn.classList.add("hidden");
    this.dom.resultBox.classList.add("hidden");
    this.dom.slotWindow.classList.add("rolling");

    let count = 0;
    const totalCycles = 26; // 회전 횟수
    let delay = 40; // 초기 딜레이 ms

    const runCycle = () => {
      // 랜덤 임의 메뉴 표시
      const tempPick = candidates[Math.floor(Math.random() * candidates.length)];
      const emoji = this.getMenuEmoji(tempPick.name);

      this.dom.slotRoller.innerHTML = `
        <div class="slot-item">
          <span class="slot-emoji">${emoji}</span>
          <span class="slot-text">${tempPick.name}</span>
        </div>
      `;

      this.sound.playTick();
      count++;

      if (count < totalCycles) {
        // 끝으로 갈수록 감속하는 지수 이징 효과
        if (count > totalCycles - 8) {
          delay += 35;
        } else if (count > totalCycles - 14) {
          delay += 15;
        }
        setTimeout(runCycle, delay);
      } else {
        // 최종 메뉴 안착
        this.finalizeRoll(finalPick);
      }
    };

    runCycle();
  }

  finalizeRoll(picked) {
    this.isRolling = false;
    this.dom.recommendBtn.disabled = false;
    this.dom.reRollBtn.classList.remove("hidden");
    this.dom.slotWindow.classList.remove("rolling");

    const emoji = this.getMenuEmoji(picked.name);
    const desc = this.getMenuDesc(picked.name);
    const catName = this.getCategoryName(picked.catId);

    // 슬롯 윈도우 최종 텍스트
    this.dom.slotRoller.innerHTML = `
      <div class="slot-item">
        <span class="slot-emoji">${emoji}</span>
        <span class="slot-text">${picked.name}</span>
      </div>
    `;

    // 결과 박스 업데이트
    this.dom.resultCategoryBadge.textContent = catName;
    this.dom.resultFoodName.textContent = picked.name;
    this.dom.resultDesc.textContent = desc;

    // 지도 검색 링크 생성
    const query = encodeURIComponent(picked.name);
    this.dom.naverMapLink.href = `https://map.naver.com/p/search/${query}`;
    this.dom.kakaoMapLink.href = `https://map.kakao.com/?q=${query}`;

    this.dom.resultBox.classList.remove("hidden");

    // 팡파레 & 꽃가루 폭죽
    this.sound.playFanfare();
    this.confetti.burst(75);

    // 추천 히스토리에 추가
    this.addHistory({
      name: picked.name,
      catId: picked.catId,
      catName: catName,
      emoji: emoji,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    });
  }

  /* ==========================================================================
     메뉴 탐색기 그리드 렌더링 & 검색
     ========================================================================== */
  renderMenuGrid() {
    const query = this.dom.menuSearchInput.value.trim().toLowerCase();
    let itemsToRender = [];

    const appendItems = (catId) => {
      const cat = this.menuData[catId];
      if (!cat) return;
      cat.items.forEach((name) => {
        if (!query || name.toLowerCase().includes(query)) {
          itemsToRender.push({
            name,
            catId,
            catName: cat.name,
            emoji: this.getMenuEmoji(name)
          });
        }
      });
    };

    if (this.currentTab === "all") {
      [1, 2, 3, 4].forEach(appendItems);
    } else {
      appendItems(Number(this.currentTab));
    }

    if (itemsToRender.length === 0) {
      this.dom.menuChipGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
          검색된 메뉴가 없습니다.
        </div>
      `;
      return;
    }

    this.dom.menuChipGrid.innerHTML = itemsToRender
      .map(
        (item) => `
        <div class="menu-chip" data-name="${item.name}" data-cat="${item.catId}">
          <button type="button" class="menu-chip-del" title="메뉴 삭제" data-name="${item.name}" data-cat="${item.catId}">&times;</button>
          <span class="menu-chip-emoji">${item.emoji}</span>
          <span class="menu-chip-name" title="${item.name}">${item.name}</span>
          <span class="menu-chip-cat">${item.catName}</span>
        </div>
      `
      )
      .join("");

    // 개별 메뉴 클릭 시 즉시 슬롯에 추천으로 적용하는 인터랙션
    this.dom.menuChipGrid.querySelectorAll(".menu-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        if (e.target.classList.contains("menu-chip-del")) return;
        const name = chip.dataset.name;
        const catId = Number(chip.dataset.cat);
        this.finalizeRoll({ name, catId });
        window.scrollTo({ top: 180, behavior: "smooth" });
      });
    });

    // 삭제 버튼 클릭 이벤트
    this.dom.menuChipGrid.querySelectorAll(".menu-chip-del").forEach((delBtn) => {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = delBtn.dataset.name;
        const catId = Number(delBtn.dataset.cat);
        if (confirm(`'${name}' 메뉴를 목록에서 삭제하시겠습니까?`)) {
          this.deleteMenu(catId, name);
        }
      });
    });
  }

  deleteMenu(catId, name) {
    if (this.menuData[catId]) {
      const idx = this.menuData[catId].items.indexOf(name);
      if (idx !== -1) {
        this.menuData[catId].items.splice(idx, 1);
        this.saveMenuData();
        this.renderMenuGrid();
      }
    }
  }

  /* ==========================================================================
     추천 히스토리
     ========================================================================== */
  addHistory(item) {
    this.history.unshift(item);
    if (this.history.length > 20) this.history.pop();
    this.saveHistory();
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.dom.historyList.innerHTML = `<div class="empty-state">아직 추천 기록이 없습니다. 버튼을 눌러보세요!</div>`;
      return;
    }

    const catColors = { 1: "var(--korean-color)", 2: "var(--chinese-color)", 3: "var(--japanese-color)", 4: "var(--western-color)" };

    this.dom.historyList.innerHTML = this.history
      .map(
        (h) => `
        <div class="history-item">
          <div class="history-item-left">
            <span>${h.emoji}</span>
            <span class="history-food">${h.name}</span>
            <span class="history-badge" style="color: ${catColors[h.catId] || '#3182f6'}; background: var(--bg-tertiary);">
              ${h.catName}
            </span>
          </div>
          <span class="history-time">${h.time}</span>
        </div>
      `
      )
      .join("");
  }

  /* ==========================================================================
     C++ 코드 뷰어
     ========================================================================== */
  loadCodeTab(tabKey) {
    const code = CPP_SOURCES[tabKey] || "// 소스코드를 찾을 수 없습니다.";
    this.dom.codeSnippet.textContent = code;
  }
}

// 애플리케이션 초기 구동
document.addEventListener("DOMContentLoaded", () => {
  window.lunchApp = new LunchRecommenderApp();
});