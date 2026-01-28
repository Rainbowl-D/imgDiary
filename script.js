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

// 초기화 및 요일 자동 설정
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

// 원고지 생성
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

// 이미지 컬러 추출 로직
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

// 이벤트 바인딩
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
            const imgUrl = e.target.result;
            // 메인 프레임 배경 설정
            $('imageFrame').style.backgroundImage = `url(${imgUrl})`;
            // 모달 내 컨테이너 배경도 함께 설정 (이미 열려있을 경우 대비)
            $('modalCanvasContainer').style.backgroundImage = `url(${imgUrl})`;
            
            $('guideText').style.display = 'none';
            applyTheme(imgUrl);
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

//브러쉬 굵기,투명도 input들 동기화
function syncInputs(name, value) {
    // 같은 name을 가진 모든 input 요소를 찾아 값을 맞춤
    const targets = document.querySelectorAll(`input[name="${name}"]`);
    targets.forEach(input => {
        input.value = value;
    });

    // 값 변경 후 즉시 브러쉬 가이드(커서) 업데이트
    if (name === 'penSize') {
        const size = value;
        brushCursor.style.width = `${size}px`;
        brushCursor.style.height = `${size}px`;
    } else if (name === 'penOpacity') {
        const opacity = value / 100;
        brushCursor.style.opacity = opacity;
        // 필요하다면 화면에 표시되는 숫자 텍스트도 업데이트
        if ($('opacityValue')) $('opacityValue').innerText = value;
    }
}

// 모든 input 요소에 이벤트 리스너 등록
document.querySelectorAll('input[name="penSize"], input[name="penOpacity"]').forEach(input => {
    input.addEventListener('input', (e) => {
        syncInputs(e.target.name, e.target.value);
    });
});

//캔버스 그리기 이벤트
const canvas = $('drawingCanvas');
const ctx = canvas.getContext('2d');
const topCanvas = $('topCanvas');
const tCtx = topCanvas.getContext('2d');
let isDrawing = false;
let undoStack = [];
const MAX_UNDO = 20;
let isEraser = false;
const brushCursor = $('brushCursor');

//브러쉬 색상 업데이트
$('penColorInput').oninput= (e) => document.documentElement.style.setProperty('--cursor-color', e.target.value);

// 상태 저장 함수 (그리기가 끝날 때마다 호출)
function saveState() {
    // 현재 캔버스 상태를 이미지 데이터로 변환
    const currentState = canvas.toDataURL();
    
    // 마지막 저장된 상태와 동일하면 중복 저장 방지
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === currentState) return;

    undoStack.push(currentState);
    
    // 최대 개수 초과 시 가장 오래된 기록 삭제
    if (undoStack.length > MAX_UNDO) {
        undoStack.shift();
    }
}

// 캔버스 크기 초기화 함수
function resizeCanvas() {
    const rect = $('imageFrame').getBoundingClientRect();
    [canvas, topCanvas].forEach(c => {
        c.width = rect.width;
        c.height = rect.height;
    });
    ctx.lineCap = ctx.lineJoin = 'round';
    tCtx.lineCap = tCtx.lineJoin = 'round';
}
// 고정 해상도 정의
const FIXED_WIDTH = 584;
const FIXED_HEIGHT = 346;
// 그리기 로직
function getCoords(e) {
    // topCanvas의 현재 화면상 실제 렌더링 크기(CSS 크기)를 가져옴
    const rect = topCanvas.getBoundingClientRect(); 
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    // 실제 해상도(584x346)와 화면 크기 사이의 비율 계산
    const scaleX = FIXED_WIDTH / rect.width;
    const scaleY = FIXED_HEIGHT / rect.height;
    
    // 비율을 곱해줌으로써 어느 크기의 화면에서 그려도 584x346 좌표로 변환됨
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return [x, y];
}

function startDrawing(e) {
    $('guideText').style.display = 'none';

    isDrawing = true;
    const [x, y] = getCoords(e);
    
    const opacity = $('penOpacityInput').value / 100;
    const color = $('penColorInput').value;
    const size = $('penSizeInput').value;

    if (isEraser) {
        // 지우개는 메인 캔버스에서 직접 동작 (destination-out)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        // 일반 그릴 때는 임시 캔버스 사용
        tCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        tCtx.globalAlpha = opacity;
        tCtx.strokeStyle = color;
        tCtx.lineWidth = size;
        tCtx.beginPath();
        tCtx.moveTo(x, y);
    }
}

function draw(e) {
   if (!isDrawing) return;
    const [x, y] = getCoords(e);

    if (isEraser) {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        tCtx.lineTo(x, y);
        tCtx.clearRect(0, 0, topCanvas.width, topCanvas.height); // 잔상 제거
        tCtx.stroke();
    }
    updateBrushCursor(e);
}

function stopDrawing() {
   if (isDrawing) {
        if (!isEraser) {
            // 임시 캔버스에 그려진 내용을 메인 캔버스에 합성
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0; // 이미 tCtx에 알파가 적용되어 있으므로 1.0으로 복사
            ctx.drawImage(topCanvas, 0, 0);
            tCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        }
        saveState();
        isDrawing = false;
    }
}

// 이벤트 리스너 등록
topCanvas.addEventListener('mousedown', startDrawing);
topCanvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

topCanvas.addEventListener('touchstart', startDrawing);
topCanvas.addEventListener('touchmove', draw);
topCanvas.addEventListener('touchend', stopDrawing);

// 가이드 크기 및 위치 업데이트 함수
function updateBrushCursor(e) {
    const size = $('penSizeInput').value;
    const rect = topCanvas.getBoundingClientRect();
    
    // 캔버스 내에서의 상대 좌표 계산
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 크기 업데이트
    brushCursor.style.width = `${size}px`;
    brushCursor.style.height = `${size}px`;
    
    // 위치 업데이트 (imageFrame이 relative이므로 absolute 좌표 사용)
    brushCursor.style.left = `${x}px`;
    brushCursor.style.top = `${y}px`;
}

// 캔버스 마우스 이벤트 리스너 추가
topCanvas.addEventListener('mousemove', (e) => {
    // PC 환경에서만 표시 (터치 이벤트 중에는 숨김 처리)
    if (e.pointerType === 'touch') {
        brushCursor.style.display = 'none';
        return;
    }
    
    brushCursor.style.display = 'block';
    updateBrushCursor(e);
});

topCanvas.addEventListener('mouseleave', () => {
    brushCursor.style.display = 'none';
});

topCanvas.addEventListener('mouseenter', (e) => {
    // 마우스가 들어올 때 즉시 위치와 크기 반영
    brushCursor.style.display = 'block';
    updateBrushCursor(e);
});

// 슬라이더 조절 시에도 즉시 크기 반영을 위해 input 이벤트에 연결
$('penSizeInput').addEventListener('input', () => {
    const size = $('penSizeInput').value;
    brushCursor.style.width = `${size}px`;
    brushCursor.style.height = `${size}px`;
});

//투명도 반영
$('penOpacityInput').oninput = (e) => {
    const val = e.target.value;
    $('opacityValue').innerText = val;
    
    // 커서 가이드에도 투명도 반영하여 미리보기 제공
    if (brushCursor) {
        brushCursor.style.opacity = val / 100;
    }
};

// 뒤로 가기 (Undo) 함수
function undo() {
    if (undoStack.length <= 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack = [];
        if (!$('imageFrame').style.backgroundImage) {
            $('imageFrame').querySelector('p').style.display = 'block';
        }
        return;
    }
    
    undoStack.pop(); 
    const previousState = undoStack[undoStack.length - 1];
    
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentAlpha = ctx.globalAlpha; // 현재 설정된 투명도 보관
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0; // 이미지를 다시 그릴 때는 완전 불투명하게 로드
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = currentAlpha; // 브러쉬 투명도 복구
    };
}

// 지우개 버튼 토글
$('eraserBtn').onclick = (e) => {
    isEraser = !isEraser;
    if (isEraser) {
        e.target.style.background = '#e74c3c';
        e.target.style.color = '#fff';
        e.target.innerText = '지우개 모드';
        $('brushCursor').classList.add('eraser');
    } else {
        e.target.style.background = '#eee';
        e.target.style.color = '#333';
        e.target.innerText = '펜 모드';
        $('brushCursor').classList.remove('eraser');
    }
};

// 뒤로가기 버튼 이벤트
$('undoBtn').onclick = undo;
window.addEventListener('keydown', (e) => {
    // Control + Z (Windows) 또는 Command + Z (Mac) 체크
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        // 입력창(input, textarea)에서 타이핑 중일 때는 실행되지 않도록 방지
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        e.preventDefault(); // 브라우저 기본 undo 방지 (필요 시)
        undo(); // 기존에 정의된 undo 함수 호출
    }
});

//전체삭제 이벤트
$('clearCanvas').onclick = () => {
    const chkConfirm = confirm("지금까지 그려놓은 모든 내용이 지워집니다.");
    if(chkConfirm){
        saveState(); // 삭제 전 상태 저장
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(!$('imageFrame').style.backgroundImage) {
            $('imageFrame').querySelector('p').style.display = 'block';
        }
    }else{
        return false;
    }
    
};

// 기존 window.onload에 resizeCanvas() 추가
const originalOnload = window.onload;
window.onload = () => {
    originalOnload();
    resizeCanvas();
};

// 이미지 캡쳐 저장
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

//그림도구 여닫기
$('closeDarwSetting').onclick = function() {
    $('editorDarwSetting').classList.toggle('active');
};


/* 모바일 제어 */

// 모바일 그림 모달 열기/닫기
const drawingModal = $('drawingModal');
const canvasContainer = $('modalCanvasContainer');
const originalFrame = $('imageFrame');

$('openMobileCanvas').onclick = () => {
    const container = $('modalCanvasContainer');
    const mainFrame = $('imageFrame');
    
    // 캔버스 엘리먼트 이동
    container.appendChild($('drawingCanvas'));
    container.appendChild($('topCanvas'));
    container.appendChild($('brushCursor'));
    
    // 배경 이미지 동기화
    if (mainFrame.style.backgroundImage) {
        container.style.backgroundImage = mainFrame.style.backgroundImage;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
    }
    
    $('drawingModal').classList.add('active'); // CSS 클래스로 제어

    setTimeout(() => {
        // 해상도 고정 (584x346)
        canvas.width = FIXED_WIDTH;
        canvas.height = FIXED_HEIGHT;
        topCanvas.width = FIXED_WIDTH;
        topCanvas.height = FIXED_HEIGHT;

        ctx.lineCap = ctx.lineJoin = 'round';
        tCtx.lineCap = tCtx.lineJoin = 'round';
        
        // 내용 복구
        if (undoStack.length > 0) {
            const img = new Image();
            img.src = undoStack[undoStack.length - 1];
            img.onload = () => ctx.drawImage(img, 0, 0, FIXED_WIDTH, FIXED_HEIGHT);
        }
    }, 50);
};

$('closeDrawingModal').onclick = () => {
    const frame = $('imageFrame');
    frame.appendChild($('drawingCanvas'));
    frame.appendChild($('topCanvas'));
    frame.appendChild($('brushCursor'));
    
    $('drawingModal').classList.remove('active');

    // 복귀 시 캔버스 내용 유지 확인
    setTimeout(() => {
        // 해상도 재확인
        canvas.width = FIXED_WIDTH;
        canvas.height = FIXED_HEIGHT;
        if (undoStack.length > 0) {
            const img = new Image();
            img.src = undoStack[undoStack.length - 1];
            img.onload = () => ctx.drawImage(img, 0, 0, FIXED_WIDTH, FIXED_HEIGHT);
        }
    }, 50);
};

let latestPreviewDataUrl = null;

// 미리보기 생성 로직 (기존 저장 로직 복제 및 수정)
$('showPreview').onclick = async () => {
    const target = $('diaryContainer');
    const originalWidth = target.style.width;
    const originalTransform = target.style.transform;

    // 캡처를 위한 스타일 고정
    target.style.width = '650px';
    target.style.transform = 'none';

    // 가이드 요소 숨김
    const topCanvas = $('topCanvas');
    const brushCursor = $('brushCursor');
    topCanvas.style.display = 'none';
    brushCursor.style.display = 'none';

    try {
        await document.fonts.ready;
        const dataUrl = await domtoimage.toPng(target, {
            width: 650,
            height: target.offsetHeight,
            style: {
                'transform': 'none',
                'left': '0',
                'top': '0'
            }
        });

        // 생성된 데이터를 전역 변수에 저장
        latestPreviewDataUrl = dataUrl;

        // 미리보기 모달에 이미지 삽입
        const img = new Image();
        img.src = dataUrl;
        $('previewImageArea').innerHTML = '';
        $('previewImageArea').appendChild(img);
        
        // 미리보기 모달 표시
        $('previewModal').style.display = 'flex';

    } catch (error) {
        console.error('미리보기 생성 실패:', error);
        alert('이미지 생성 중 오류가 발생했습니다.');
        latestPreviewDataUrl = null; // 실패 시 초기화
    } finally {
        // 원래 스타일 복구
        target.style.width = originalWidth;
        target.style.transform = originalTransform;
        topCanvas.style.display = '';
        brushCursor.style.display = '';
    }
};

$('closePreviewModal').onclick = () => {
    $('previewModal').style.display = 'none';
    $('hiddenCaptureArea').innerHTML = '';
};

//모바일 이미지 저장
$('saveImageMobile').onclick = () => {
    // 미리보기가 성공적으로 생성되었는지 확인
    if (!latestPreviewDataUrl) {
        alert('미리보기가 아직 생성되지 않았거나 오류가 발생했습니다.');
        return;
    }

    const link = document.createElement('a');
    const dateVal = $('dateInput').value || 'diary';
    
    link.download = `diary-${dateVal}.png`;
    link.href = latestPreviewDataUrl; // 미리 저장해둔 데이터 사용
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};