# 나와 닮은 캐릭터는? — 배포 안내

## 1. 폴더 구성

레포지토리 루트(또는 배포할 폴더)에 아래 파일들을 그대로 올리면 됩니다.

```
index.html
style.css
app.js
tests.js
characters.js
.nojekyll
images/            <- 캐릭터 사진을 여기에 넣기 (아래 파일명 그대로)
```

## 2. 캐릭터 사진 넣는 법

`characters.js` 맨 위의 `CHARACTER_IMAGE_BASE` 값이 사진을 찾는 기본 경로입니다.

```js
const CHARACTER_IMAGE_BASE = "images/";
```

- 지금처럼 `index.html`과 같은 위치에 `images/` 폴더를 만들어 파일을 넣으면 그대로 동작합니다.
- 다른 경로(예: `assets/characters/`)나 별도 CDN 주소를 쓰고 싶다면 이 값 한 줄만 바꾸면 전체 44개 캐릭터에 한 번에 적용됩니다.
- 아직 사진이 없는 캐릭터는 자동으로 이모지로 대체되어 화면이 깨지지 않습니다. (`app.js`의 `setResultPhoto` 함수가 처리)

`images/` 폴더에 넣어야 할 파일명은 다음과 같습니다 (대소문자까지 정확히 일치해야 합니다 — GitHub Pages 서버는 대소문자를 구분합니다):

- images/chiikawa.webp (치이카와)
- images/hachiware.webp (하치와레)
- images/usagi.webp (우사기)
- images/momonga.webp (모몽가)
- images/rakko.webp (랏코)
- images/kurimanju.webp (쿠리만쥬)
- images/shisa.webp (시사)
- images/kanichan.webp (카니짱)
- images/winnie-pooh.webp (곰돌이 푸)
- images/mickey.webp (미키 마우스)
- images/donald.webp (도널드 덕)
- images/goofy.webp (구피)
- images/olaf.webp (올라프)
- images/simba.webp (심바)
- images/ariel.webp (에리얼)
- images/genie.webp (지니)
- images/tigger.webp (티거)
- images/stitch.webp (스티치)
- images/dory.webp (도리)
- images/sulley.webp (설리반)
- images/mike.webp (마이크)
- images/remy.webp (레미)
- images/joy.webp (기쁨이)
- images/anger.webp (버럭이)
- images/fear.webp (소심이)
- images/sadness.webp (슬픔이)
- images/disgust.webp (까칠이)
- images/ursula.webp (우르술라)
- images/maleficent.webp (말레피센트)
- images/scar.webp (스카)
- images/evil-queen.webp (이블 퀸)
- images/hades.webp (하데스)
- images/cruella.webp (크루엘라)
- images/jafar.webp (자파)
- images/captain-hook.webp (후크 선장)
- images/woody.webp (우디)
- images/buzz.webp (버즈)
- images/hamm.webp (햄)
- images/rex.webp (렉스)
- images/bullseye.webp (불스아이)
- images/mr-potato-head.webp (미스터 포테이토 헤드)
- images/mrs-potato-head.webp (미세스 포테이토 헤드)
- images/bo-peep.webp (보핍)
- images/slinky.webp (슬링키)
- images/jessie.webp (제시)

이 사진들은 이미 이번에 보내주신 원본 파일을 정리해서 `images/` 폴더에 함께 넣어드렸습니다 (한글 파일명 → 위 영문 파일명으로 변경, 모든 파일을 `.webp`로 통일, 큰 이미지는 최대 1000px로 축소해 로딩 속도를 확보했습니다). 원본 45개 파일 모두 손상 없이 정상적으로 열렸고 확장자와 실제 형식이 다른 파일도 없었습니다 — 별도로 고쳐야 할 오류는 없었습니다.

## 3. GitHub Pages로 배포하기

1. GitHub에 새 저장소를 만들고, 위 파일들을 그대로 커밋 & 푸시합니다. (이미지 폴더 포함)
2. 저장소의 **Settings → Pages** 로 이동합니다.
3. **Build and deployment → Source**를 "Deploy from a branch"로 두고, 배포할 브랜치(`main` 등)와 폴더(`/root` 또는 `/docs`)를 선택합니다.
4. 저장하면 몇 분 내로 `https://<사용자명>.github.io/<저장소명>/` 주소에서 접속할 수 있습니다.

이 프로젝트의 모든 경로(`style.css`, `app.js`, `images/...` 등)는 **상대 경로**로 작성되어 있어서, 저장소 이름이 무엇이든(=주소가 루트든 하위 폴더든) 그대로 동작합니다. 절대 경로(`/style.css`처럼 슬래시로 시작하는 경로)로 바꾸지만 않으면 됩니다.

### 참고 사항

- `.nojekyll` 파일은 GitHub Pages가 기본으로 돌리는 Jekyll 처리 과정을 건너뛰기 위한 빈 파일입니다. 그대로 두세요.
- GitHub Pages 서버는 **대소문자를 구분**합니다. 로컬(윈도우/맥)에서는 `Chiikawa.PNG`처럼 넣어도 잘 열리지만, 실제 배포 후에는 안 뜰 수 있으니 파일명을 정확히 맞춰주세요.
- 이모지는 [Twemoji](https://github.com/twitter/twemoji) CDN(cdnjs)을 통해 이미지로 변환되어 표시되므로, 아이폰/안드로이드/윈도우 등 어떤 기기로 접속해도 동일하게 보입니다. 인터넷 연결이 없는 상태로 테스트하면 이모지가 일반 텍스트로만 보일 수 있는데, 실제 배포된 사이트에서는 정상적으로 로드됩니다.
- 캐릭터 이름과 사진은 각 원작사(치이카와 관련사, 디즈니, 픽사 등)의 저작권/상표권 대상입니다. 개인적으로 테스트하는 것과 별개로, 실제로 널리 공유/홍보할 계획이라면 캐릭터를 자체 제작 캐릭터로 교체하는 것을 권장합니다.
