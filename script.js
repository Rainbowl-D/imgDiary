const $ = id => document.getElementById(id);
const MOOD_DATA = {
    "날씨": {
        'sunny': { icon: 'wb_sunny', label: '맑음' },
        'cloudy': { icon: 'filter_drama', label: '흐림' },
        'rainy': { icon: 'umbrella', label: '비' },
        'air': { icon: 'air', label: '바람' },
        'electric': { icon: 'electric_bolt', label: '번개' },
        'snowy': { icon: 'ac_unit', label: '눈' }
    },
    "기분": {
        'happy': { icon: 'sentiment_very_satisfied', label: '최고' },
        'neutral': { icon: 'sentiment_satisfied', label: '보통' },
        'sad': { icon: 'sentiment_very_dissatisfied', label: '우울' },
        'angry': { icon: 'mood_bad', label: '화남' },
        'soso': { icon: 'sentiment_neutral', label: '정색' },
        'heart_broken': { icon: 'heart_broken', label: '마상' },
        'thumb_up_alt': { icon: 'thumb_up_alt', label: '따봉' },
        'thumb_down_alt': { icon: 'thumb_down_alt', label: '붐따' }
    },
    "활동": {
        'study': { icon: 'menu_book', label: '공부,독서' },
        'work': { icon: 'laptop_mac', label: '업무' },
        'exercise': { icon: 'fitness_center', label: '운동' },
        'rest': { icon: 'bedtime', label: '휴식' },
        'eat': { icon: 'flatware', label: '식사' },
        'create': { icon: 'create', label: '글' },
        'draw': { icon: 'color_lens', label: '그림' },
        'shopping': { icon: 'shopping_basket', label: '쇼핑' },
        'flight': { icon: 'flight', label: '여행' },
        'videocam': { icon: 'videocam', label: '영화' },
        'medicatio': { icon: 'medication_liquid', label: '병원' },
        'cleaning': { icon: 'cleaning_services', label: '청소' },
        'photo_camera': { icon: 'photo_camera', label: '사진' },
        'sports_esports': { icon: 'sports_esports', label: '게임' },
        'textsms': { icon: 'textsms', label: '채팅' }
    },
    "아이템": {
        'star': { icon: 'grade', label: '별' },
        'favorite': { icon: 'favorite', label: '하트' },
        'audiotrack': { icon: 'audiotrack', label: '음표' },
        'schedule': { icon: 'schedule', label: '시계' },
        'mail': { icon: 'mark_as_unread', label: '메일(편지봉투)' },
        'calculate': { icon: 'calculate', label: '계산기' },
        'idea': { icon: 'emoji_objects', label: '아이디어' },
        'home': { icon: 'home', label: '집' },
        'coffee': { icon: 'coffee', label: '커피' },
        'sports_bar': { icon: 'sports_bar', label: '맥주' },
        'animal': { icon: 'pets', label: '동물' },
        'emoji_events': { icon: 'emoji_events', label: '트로피' },
        'pig': { icon: 'savings', label: '돼지저금통' },
        'build': { icon: 'build', label: '공구' },
        'smartphone': { icon: 'smartphone', label: '휴대폰' },
        'battery_1_bar': { icon: 'battery_1_bar', label: '배터리_방전' },
        'battery_full': { icon: 'battery_full', label: '배터리_완충' },
        'book': { icon: 'book', label: '책' },
        'rocket': { icon: 'rocket_launch', label: '로켓' },
        'delete': { icon: 'delete', label: '쓰레기통' },
        'luggage': { icon: 'luggage', label: '여행캐리어' },
        'trending_up': { icon: 'trending_up', label: '상승곡선' },
        'thermostat': { icon: 'thermostat', label: '온도계' }
    }
};

function initMoodSelect() {
    const select = $('moodSelect');
    select.innerHTML = ''; // 기존 옵션 초기화

    for (const [category, items] of Object.entries(MOOD_DATA)) {
        const group = document.createElement('optgroup');
        group.label = category; // 카테고리 이름 (날씨, 기분 등)

        for (const [key, info] of Object.entries(items)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = info.label;
            group.appendChild(opt);
        }
        select.appendChild(group);
    }
}

// 1. 초기화 및 요일 자동 설정
window.onload = () => {
    const now = new Date();
    $('dateInput').value = now.toISOString().substring(0, 10);
    updateDateAndDay();
    renderGrid('');

    //셀렉트 옵션 채우기
    initMoodSelect();

    // --- 글쓴이 로컬 스토리지 로직 추가 ---
    const savedWriter = localStorage.getItem('diary_writer');
    if (savedWriter) {
        $('writerInput').value = savedWriter;
        $('displayWriter').innerText = savedWriter; // 화면에 즉시 반영
    }
};

function updateDateAndDay() {
    const d = new Date($('dateInput').value);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[d.getDay()];
    
    $('dayInput').value = dayName;
    $('displayDate').innerText = `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
    $('displayDay').innerText = dayName + '요일';

    const selectedKey = $('moodSelect').value;
    let moodInfo = null;
    
    // 카테고리 순회하며 아이콘 정보 찾기
    for (const cat in MOOD_DATA) {
        if (MOOD_DATA[cat][selectedKey]) {
            moodInfo = MOOD_DATA[cat][selectedKey];
            break;
        }
    }

    if (moodInfo) {
        // innerHTML로 삽입 시 클래스명이 정확한지 확인
        $('displayWeather').innerHTML = `
            <span class="material-icons">
                ${moodInfo.icon}
            </span>
        `;
    }
}

// 2. 원고지 생성
function renderGrid(text) {
    const container = $('gridContent');
    container.innerHTML = '';
    
    const lines = text.split('\n'); // 엔터를 기준으로 줄 나누기
    const gridData = [];

    lines.forEach(line => {
        const chars = line.split('');
        for (let i = 0; i < chars.length; i++) {
            gridData.push(chars[i]);
        }
        
        // 엔터 효과: 현재 줄의 남은 칸을 빈 공간으로 채워 다음 글자가 다음 줄 시작점에 오게 함
        const remainingInLine = 15 - (gridData.length % 15);
        if (remainingInLine < 15) {
            for (let i = 0; i < remainingInLine; i++) {
                gridData.push(''); 
            }
        }
    });

    // 최소 5행(50칸) 보장
    const totalCells = Math.max(60, Math.ceil(gridData.length / 15) * 15);

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.innerHTML = `
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="5" y="5" width="90" height="90" fill="none" stroke="var(--diary-line)" stroke-width="2" rx="10" />
            </svg>
            <span class="char">${gridData[i] || ''}</span>
        `;
        container.appendChild(cell);
    }
}

// 3. 이미지 컬러 추출 로직
function rgbToHex(rgb) {
    const vals = rgb.match(/\d+/g);
    return "#" + vals.slice(0, 3).map(x => {
        const hex = Math.max(0, Math.min(255, parseInt(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}
function applyTheme(src) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 10; canvas.height = 10; // 작게 그려서 평균색 추출
        ctx.drawImage(img, 0, 0, 10, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;
        let r=0, g=0, b=0;
        for(let i=0; i<data.length; i+=4) { r+=data[i]; g+=data[i+1]; b+=data[i+2]; }
        r=Math.floor(r/100); g=Math.floor(g/100); b=Math.floor(b/100);

        document.documentElement.style.setProperty('--diary-bg', `rgb(${r+200},${g+200},${b+200})`);
        document.documentElement.style.setProperty('--diary-line', `rgb(${r},${g},${b})`);
        document.documentElement.style.setProperty('--diary-text', `rgb(${Math.max(0,r-50)},${Math.max(0,g-50)},${Math.max(0,b-50)})`);

        const bgStr = `rgb(${r+200},${g+200},${b+200})`;
        const lineStr = `rgb(${r},${g},${b})`;
        const textStr = `rgb(${Math.max(0,r-50)},${Math.max(0,g-50)},${Math.max(0,b-50)})`;
        $('bgColorInput').value = rgbToHex(bgStr);
        $('lineColorInput').value = rgbToHex(lineStr);
        $('textColorInput').value = rgbToHex(textStr);
    };
    img.src = src;
}

// 4. 이벤트 바인딩
$('dateInput').onchange = updateDateAndDay;
$('moodSelect').onchange = updateDateAndDay;
$('titleInput').oninput = e => $('displayTitle').innerText = e.target.value;
$('contentInput').oninput = e => renderGrid(e.target.value);
$('writerInput').oninput = e => {
    const value = e.target.value;
    localStorage.setItem('diary_writer', value); // 로컬 스토리지 저장
    $('displayWriter').innerText = value;         // 화면 실시간 반영
};

$('imgInput').onchange = e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            $('imageFrame').style.backgroundImage = `url(${e.target.result})`;
            $('imageFrame').innerHTML = '';
            applyTheme(e.target.result);
        };
        reader.readAsDataURL(file);
    }
};

$('bgColorInput').oninput = (e) => document.documentElement.style.setProperty('--diary-bg', e.target.value);
$('lineColorInput').oninput = (e) => document.documentElement.style.setProperty('--diary-line', e.target.value);
$('textColorInput').oninput = (e) => document.documentElement.style.setProperty('--diary-text', e.target.value);

// 도장 관련 이벤트 추가
$('stampToggle').onchange = (e) => {
    $('stampLayer').style.display = e.target.value === 'show' ? 'block' : 'none';
};
$('stampTextInput').oninput = (e) => {
    $('stampText').innerText = e.target.value;
};
$('stampColorInput').oninput = (e) => {
    document.documentElement.style.setProperty('--stamp-color', e.target.value);
};

$('saveImage').onclick = () => {
    const target = $('diaryContainer');

    // 폰트가 완전히 로드되었는지 확인 후 실행
    document.fonts.ready.then(() => {
        domtoimage.toPng(target, {
            quality: 1.0,
            bgcolor: getComputedStyle(document.documentElement).getPropertyValue('--diary-bg'),
            // 폰트가 잘린다면 여백(width, height)을 명시적으로 지정할 수 있습니다.
            width: target.clientWidth,
            height: target.clientHeight,
            style: {
                // 캡처 시 폰트 렌더링을 강제하기 위한 스타일 주입
                'font-family': "'IsYun', cursive"
            }
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `diary-${$('dateInput').value}.png`;
            link.href = dataUrl;
            link.click();
        })
        .catch((error) => {
            console.error('이미지 저장 중 오류 발생:', error);
        });
    });
};

// --- 에디터 토글 로직 ---
const editorPanel = $('editorPanel');
const openBtn = $('openEditor');
const closeBtn = $('closeEditor');

// 에디터 열기
openBtn.onclick = () => {
    editorPanel.classList.add('active');
};

// 에디터 닫기
closeBtn.onclick = () => {
    editorPanel.classList.remove('active');
};

// 화면 크기 변화에 따라 열기 버튼 표시 여부 결정
window.onresize = () => {
    if (window.innerWidth <= 768) {
        openBtn.style.display = 'block';
    } else {
        openBtn.style.display = 'none';
        editorPanel.classList.remove('active'); // 데스크탑 복귀 시 패널 초기화
    }
};

// 초기 로드 시 체크
if (window.innerWidth <= 768) openBtn.style.display = 'block';