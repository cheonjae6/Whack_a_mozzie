// const modalWindow = document.getElementById("modal-container");
const $modal = {
    container: document.getElementById('modal-container'),
    username: document.getElementById('gameover-submit-yourScore-name'),
    submit: document.getElementById('gameover-submit-yourScore-button'),
    SendToServer: document.getElementById("sendToServer"),
};

const square = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');  // 타이머
const mozzie = document.querySelectorAll('.mozzie');    // 모기
let Score = document.querySelector('.score');
let randomValue = 0; // 폭탄, mozzie 둘 중 하나 무작위로 나오게 하는 것과 관련된 변수
let mozzieAppearCheck = 0;   // 모기 등장 여부 저장하는 변수 (0: 등장 안함, 1: 등장함)
let boomAppearCheck = 0;     // 폭탄 등장 여부 저장하는 변수 (0: 등장 안함, 1: 등장함)
let boomClick = 0;   // 폭탄을 클릭했는지 저장하는 변수 (0: 안했음, 1: 했음)

document.addEventListener("DOMContentLoaded", function() {
    $modal.container.style.display = "none";
    setTimeout(mozzieMove, 500);
});

// 모기를 잡을 때마다 올라가는 스코어 저장하는 변수
let result = 0;

// 현재 타임은 미리 html파일에서 60을 적어놓아서 textContent로 currentTime에 저장
let currentTime = timeLeft.textContent;

// 클릭된 위치와 비교될 변수
let hitPosition1;
let hitPosition2;
let boomHitPosition1;
let boomHitPosition2;

// 모기를 랜덤한 위치에 만들어 주는 함수
function randomSquare() {
    // 모든 위치에서 모기와 폭탄을 지워주는 반복문을 forEach로 실행
    // 모기가 한 마리씩 나오거나 폭탄이 하나씩 때문에 항상 리셋해주는 것
    square.forEach(className => {
        className.classList.remove('mozzie');
        className.classList.remove('boom');
    });
    
    let boomRandomPosition1 = square[Math.floor(Math.random() * 36)];
    let boomRandomPosition2 = square[Math.floor(Math.random() * 36)];
    let randomPosition1 = square[Math.floor(Math.random() * 36)];
    let randomPosition2 = square[Math.floor(Math.random() * 36)];
    
    randomPosition1.classList.add('mozzie');
    randomPosition2.classList.add('mozzie');
    boomRandomPosition1.classList.add('boom');
    boomRandomPosition2.classList.add('boom');
    
    // 앞의 예를 이어서 square[5]면 square에 id 6이 저장된다. 배열은 0부터 시작하니까
    hitPosition1 = randomPosition1.id;
    hitPosition2 = randomPosition2.id;
    boomHitPosition1 = boomRandomPosition1.id;
    boomHitPosition2 = boomRandomPosition2.id;
}

// 클릭된 곳에 모기가 있으면 점수를 올려주는 부분
square.forEach(para => {
    // 마우스 커서가 보드에 위로 올라온 상태인 경우
    para.addEventListener('mousedown', () => {
        // para의 id와 앞에서 저장된 모기의 위치나 폭탄의 위치가 같으면 밑의 내용을 실행
        if(para.id === hitPosition1 || para.id === hitPosition2) {
            result = result + 1;
            Score.textContent = result;    
            // 잡은 모기는 화면에서 없애준다.
            para.classList.remove('mozzie');
        } else if (para.id === boomHitPosition1 || para.id === boomHitPosition2) {
            boomClick = 1;
            currentTime = 0;
            para.classList.remove('boom');
        }
    })
})

// timerId 변수를 만들어주고
let timerId = null;

// 앞에까진 함수만 넣은 거고 이제는 지정된 시간마다 모기가 나오게 도와줄 함수
function mozzieMove() {
    timerId = setInterval(() => {
        randomSquare();
        countDown();
    }, 1000);
}

function Resetting() {
    currentTime = 60;
    timeLeft.textContent = currentTime;
    result = 0;
    Score.textContent = result;
    boomClick = 0;

    square.forEach(className => {
        className.classList.remove('mozzie');
        className.classList.remove('boom');
    });
}

// 카운트다운 해주는 함수
function countDown() {
    // 1 빼주고 textContent를 이용해서 화면에 출력
    // 위의 mozzieMove()에서 1초에 한 번씩 실행하라고 했으니 계속 1씩 마이너스
    if (boomClick === 0) {
        currentTime--;    
    }
    timeLeft.textContent = currentTime;

    // 1초씩 카운트되다가 0에 도달하면 실행
    if(currentTime === 0 || boomClick === 1) {
        // 1초씩 실행하는 Interval을 없애주는 clearInterval
        clearInterval(timerId);
        // 전체 얻은 점수를 alert에 띄운다.
        // alert('Game over. Your score is ' + result);
        document.getElementById("getYourScore").textContent = result;
        $modal.container.style.display = "flex";
        // 다시 게임 시작 버튼을 눌렀을 경우 게임 시작할 수 있게 한다.

        $modal.submit.onclick = async () => {
            let username = $modal.username.value;   // $modal은 모달창과 관련된 것입니다.
            // 아래 3줄의 console.log는 console에서 확인하고 싶으시면 쓰셔도 되구요.
            console.log($modal);        
            console.log($modal.username);
            console.log(username);
            // alert($modal.username.value);

            username = username.trim();     // 모달창에서 유저 이름을 저장한 문자열에서 공백을 제거하여 다시 모달창의 유저 이름 입력하는 부분에 저장합니다.
                                            // 예를 들면 '     abcde     '이 trim() 메서드에 의하여 'abcde'이 되어 username에 저장되는 것이죠
            if (username === undefined) {   // 모달창의 유저 이름 입력창에 아무 문자도 입력하지 않을 경우 if문 안 코드가 실행됩니다.
                alert("User name is empty! Please fill in the textbox");
                return;
            }

            const reqData = {       // 아래 3줄의 프로퍼티를 가진 객체 리터럴을 참조하는 reqData를 선언합니다.
                gamename: "whackAMozzie",
                username: username,
                score: result,
            };

            $modal.SendToServer.innerHTML = "⏱   Please wait a second...";  // 이건 있어도 좋고 없어도 좋습니다.

            console.log(result, typeof(result));
            
            const res = await postData(reqData);    // 서버에 객체 참조변수인 reqData의 프로퍼티들을 전송하는 거 같아요.
            $modal.SendToServer.textContent = "👍🏻   Submission completed!!!";
            $modal.SendToServer.style.color = "rgb(27, 168, 22)";
            console.log(res);
        };
        
        return;
    }
}

///////////////////////////////////////
async function postData(data) {
    const url = "https://script.google.com/macros/s/AKfycbyaY8lg8Ba_0oh3I5Q-X6HReYwStOwIYVhOjBK-zk1bvhWs9BKL2bi17-GEpvjUI5pyhA/exec";
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  
    return res.json();
  }
  /////////////////////////////////