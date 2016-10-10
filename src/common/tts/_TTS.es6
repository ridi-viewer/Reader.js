//
// * TTS 노트.
//
//    * 문단/문장 나누기 규칙.
//
//    1. 텍스트가 없는 노드는 무시한다.
//    2. 읽을 수 없는 문자만 가지고 있는 노드는 무시한다.
//        - space(\s), newline(\n), tab(\t), retrun carriage(\r) 등 공백문자는 읽을 수 없다.
//        - 공백문자 중 개행문자는 디오텍에서 잡음으로 바꿀때가 있어 반드시 무시해아한다.
//    3. 형제 노드 중에 br 노드가 있을 때는 Chunk로 만든다.
//        - 마침표 또는 문장의 끝을 의미하는 문자 없이 newline 또는 br 태그가 쓰일 경우는 제목, 주제 등
//          의미를 부여하는 의도적인 줄 바꿈이기에 하나의 문장으로 봐야한다.
//             예) <h2>'성공하고 싶다'를<br>'행복해지고 싶다'로<br>바꾸자</h2>
//    4. [Deprecated] 이미지 노드는 alt 속성에 한 자 이상의 문자가 있을 때만 Chunk로 만든다.
//        - 단, 접미에 이미지 파일 확장자가 있다면 무시한다. (이미지 파일명을 넣은 출판사가 종종 있다)
//        - alt가 있는데 0자일 때가 있다.
//             예) <img id="cover" src="front_cover.jpg" alt="">
//    5. 후리가나를 표시하는데 사용되는 ruby, rt, rp 노드는 무시한다.
//        - 후리가나는 독음, 주음부호, 한어병음, 한국 한자음이라고도 불린다.
//        - 단, 후리가나의 대상을 나타내는 rb는 무시하면 안 된다.
//             예) <ruby><rb>雪婆</rb><rt>ゆきば</rt></ruby>
//    6. 윗/아래 첨자를 나타내는 sub, sup 노드는 무시한다.
//        - 첨자는 주석 또는 참고의 의미라 본문과 같이 읽게되면 문장 이해에 방해가 된다.
//        - sub, sup 안에 링크가 있을 수도 링크가 sub, sup를 포함하고 있을 수도 있다.
//             예) <sup><a id="comment_1">(1)</a></sup>
//    7. 한 문장 이상의 문장을 포함한 노드는 Chunk로 만든다.
//        - 단, 다수의 문장일 때는 문장 하나당 Chunk 하나로 만든다.
//        - 마지막 글자가 .|。|?|!|"|”|'|’|」|』 중 하나일 때 문장이라고 본다.
//    8. 다수의 문장을 나눌 때 사용되는 기준은 .|。|?|! 이렇게 네 개이다.
//        - 단, 기준이 발견된 문자의 다음 문자가 .|。|,|"|”|'|’|」|\]|\)|\r|\n 중 하나일 때는 문장으로 생각하지 않는다.
//          (이는 대화체나 마침표가 반복적으로 사용된 문장을 잘라먹을 우려가 있기 때문이다)
//             예) <p>그가 '알았다고.' 말했잖아요?</p>
//    9. 한 문장이 되지 못하는 노드는 다음 노드와 합친다.
//        - 문장에서 특정 단어에 태그를 입혔을 때 그 단어 하나만 문장으로 구성될 우려가 있기 때문이다.
//             예) <p>제가 <b>하쿠나 마타타</b>라고 말하면 가는 겁니다.</p>
//        - 다음 노드에 대해서도 1~6번을 따른다.
//             - 단, 2번은 previousSibling이 span일 경우 무시한다.
//        - 다음 노드도 문장이 되지 못 한다면 다음 노드와 합친다.
//        - 마지막 노드를 만날 때까지 문장이 되지 못 한다면 Chunk로 만든다.
//
//
//    * 디오텍이 권장하는 텍스트 규칙.
//
//    1. 띄어쓰기, 철자, 구두점 등은 반드시 맞춤법에 맞아야 한다.
//    2. 마침표(.) 는 가능한 문장 마지막에만 사용한다.
//        - 마침표가 들어간 단어는 마침표를 없애거나 다른 기호로 바꿔 사용한다.
//             예) 출.도착 → 출도착
//    3. 띄어쓰기를 적절하게 사용한다.
//        - 기본적으로 한 어절 내에서는 쉬지 않고 그대로 연결해서 발음한다. 따라서, 어절이 길어질수록 명확성이 떨어진다.
//             예) “항공권분실”과 “항공권 분실”을 비교해 보자. 후자가 전자보다 “항공권”과 ”분실”을 좀더 명확하게 발음한다.
//        - 복합명사는 가급적 띄어쓰기를 하면 좋다.
//             예) 국내선스케줄 → 국내선 스케줄
//    4. 날짜 (년,월,일)
//        - 숫자와 한글(년,월,일)은 공백없이 붙여서 쓰고, 각 단위 사이는 띄어 쓴다.
//             예) 2002년 2월 22일 (이천이년 이월 이십이일)
//        - 슬래쉬(/)를 사용한 날짜 표기는 년, 월, 일 순으로 숫자와 슬래쉬(/) 사이에 공백 없이 입력한다.
//             예) 2002/2/22 (이천이년 이월 이십이일)
//    5. 시각 (시,분,초)
//        - 숫자와 한글(시,분,초)은 공백 없이 붙여서 쓰고, 각 단위 사이는 띄어 쓴다.
//             예) 12시30분30초 (열두시삼십분삼십초)
//        - 콜론(:)를 사용한 날짜 표기는 시, 분, 초 순으로 숫자와 콜론(:) 사이에 공백 없이 입력한다.
//             예) 12:30:30 (열두시 삼십분 삼십초)
//    6. 전화번호
//        - 대시(-)를 사용한 전화번호 표기는 숫자와 대시(-) 사이에 공백 없이 입력한다.
//             예) 02-2297-1450 (공이 이이구칠에 일사오공)
//    7. URL, E-mail 주소
//        - 시작은 반드시 영문 알파벳으로 시작하여야 한다.
//        - 사전에 등록되어 있는 단어는 사전의 발음대로 읽는다
//             예) http://www.hcilab.co.kr (에이취티티피 떠블류 떠블류 떠블류쩜 에이치씨아이랩쩜 씨오쩜 케이알)
//    8. 숫자와 단위
//        - 숫자와 단위는 붙여 쓴다.
//             예) 50,500원 (오만 오백 원), 13자리 (열세 자리)
//    9. 기타
//        - 기호는 특별한 경우를 제외하고 무시된다. 따라서 복합 명사처럼 만들기 위해서는 공백(‘ ‘)으로 대치하는 것이 좋다.
//             예) 서울/제주 → “서울 제주”
//
//
//    * 이것들은 어짜쓰까...
//
//    - 숫자에 제곱의 의미로 윗첨자가 붙었을 때. (숫자만 읽어버린다. 하하)
//    - span과 스타일을 이용해 윗첨자 또는 아랫첨자를 흉내냈을 때. (아오... 왜그러니.. 어소링 툴에 있을텐데 분명 =_=)
//    - 게임 판타지 소설에서 자주 나오는 캐릭터 또는 장비 스테이터스. (이걸 다 읽어줘야 하나...)
//    - 문장으로 생각했는데 뒤에 붙어야할 애가 있다.
//         예) <h2>내 '안'<span>에서</span><br>천직<spa...
//

import TTSPiece from './TTSPiece';
import TTSChunk from './TTSChunk';
import TTSChunkCollection from './TTSChunkCollection';
import TTSRange from './TTSRange';
import TTSUtil from './TTSUtil';
import _EPub from '../_EPub';

export default class _TTS {
  get chunks() { return this._chunks; }

  constructor() {
    this.debug = false;
    this.processedNodeMaxIndex = -1;
    this._chunks = new TTSChunkCollection();
  }

  makeChunksBySerializedRange(serializedRange) {
    const range = rangy.deserializeRange(serializedRange, document.body);
    if (range === null) {
      throw 'TTS: range is invalid.';
    }

    const nodes = _EPub.getTextAndImageNodes();
    if (nodes === null) {
      throw 'TTS: nodes is empty. make call epub.getTextAndImageNodes().';
    }

    let nodeIndex = -1;
    let wordIndex = 0;
    for (let i = 0, offset = 0; i < nodes.length; i++, offset = 0) {
      if (nodes[i] === range.startContainer) {
        nodeIndex = i;
        const words = range.startContainer.textContent.split(TTSUtil.getSplitWordRegex());
        for (; wordIndex < words.length; wordIndex++) {
          if (range.startOffset <= offset + words[wordIndex].length) {
            break;
          } else {
            offset += (words[wordIndex].length + 1);
          }
        }
        break;
      }
    }

    this.makeChunksByNodeLocation(nodeIndex, wordIndex);
  }

  // nodeIndex / wordIndex : inclusive
  makeChunksByNodeLocation(nodeIndex = -1, wordIndex = -1) {
    const nodes = _EPub.getTextAndImageNodes();
    if (nodes === null) {
      throw 'tts: nodes is empty. make call epub.getTextAndImageNodes().';
    }

    const prevLastChunk = this.chunks.last;
    let _nodeIndex = Math.max(nodeIndex, 0);
    let _wordIndex = Math.max(wordIndex, 0);
    // _addChunk에서 문장 단위로 chunk를 분리하면 chunk가 더 늘어날 것이기 때문에 용량의 1/5만 만듦
    const reserveChunksCount = (this.chunks.oneSideReserveCapacity / 5).toFixed();
    let maxIndex = Math.min(_nodeIndex + reserveChunksCount, nodes.length - 1);

    const incrementMaxIndex = () => { maxIndex = Math.min(maxIndex + 1, nodes.length - 1); };
    let pieceBuffer = [];
    const flushPieces = () => {
      this._addChunk(pieceBuffer);
      pieceBuffer = [];
    };

    for (; _nodeIndex <= maxIndex + 1; _nodeIndex++, _wordIndex = -1) {
      if (_nodeIndex >= nodes.length) {
        flushPieces();
        break;
      }

      let piece;
      try {
        piece = new TTSPiece(_nodeIndex, _wordIndex);
      } catch (e) {
        console.log(e);
        break;
      }

      // maxIndex + 1까지 살펴보는 것은 이전까지 만들어둔 piece들이 완성된 문장인지 판단하기 위함이다.
      const aboveMaxIndex = (_nodeIndex > maxIndex);

      if (piece.isInvalid()) {
        // invalid (아랫 첨자 등) 의 경우 문장의 끝이 아닐 수 있다.
        if (!aboveMaxIndex) {
          incrementMaxIndex();
        }
      } else if (piece.isOnlyWhitespace()) {
        flushPieces();
        if (!aboveMaxIndex) {
          incrementMaxIndex();
        }
      } else if (!aboveMaxIndex && piece.isNextSiblingBr()) {
        pieceBuffer.push(piece);
        // 다음 element가 br이라면 현재 chunk의 끝 부분은 문장이 끝나는 부분이라고 판단할 수 있다.
        // 문장이 완성되었으므로 flush.
        flushPieces();
      } else {
        if (!aboveMaxIndex) {
          pieceBuffer.push(piece);
        }

        if (piece.length > 1 && piece.isSentence()) {
          // 현재 piece의 말단 부분이 문장의 끝 부분을 포함하고 있으므로
          // 이제까지 쌓인 piece들이 완성된 문장이 되었다는 판단을 할 수 있다.
          flushPieces();
        } else if (_nodeIndex >= maxIndex) {
          // 문장의 나머지 부분이 더 존재하는 경우이므로 계속 진행한다.
          incrementMaxIndex();
          // 현재 node부터 다시 처리해야하므로.
          _nodeIndex--;
        }
      }
    }
    this.processedNodeMaxIndex = maxIndex;

    this.didFinishMakeChunks(prevLastChunk);

    return this.chunks.length;
  }

  didPlaySpeech(chunkId) {

  }

  didFinishSpeech(chunkId) {
    const nodes = _EPub.getTextAndImageNodes() || [];
    if (nodes.length - 1 > this.processedNodeMaxIndex) {
      const curChunk = this.chunks.getChunkById(chunkId);
      const lastChunk = this.chunks.last;
      if (curChunk !== null && lastChunk !== null) {
        const curPiece = curChunk.getPiece(curChunk.range.endOffset);
        const lastPiece = lastChunk.getPiece(lastChunk.range.endOffset);
        // 아래의 30을 더 작은 값으로 줄일 경우 끊김 현상이 발생할 수 있다.
        if (Math.max(lastPiece.nodeIndex - 30, 0) < curPiece.nodeIndex) {
          this.makeChunksByNodeLocation(lastPiece.nodeIndex + 1, 0);
        }
      }
      return true;
    }
    return false;
  }

  didFinishMakeChunks(prevLastChunk) {

  }

  getPageOffsetFromChunkId(chunkId) {

  }

  getScrollYOffsetFromChunkId(chunkId) {

  }

  _addChunk(pieces) {
    if (pieces.length === 0) {
      return;
    }

    // 문자열을 문장 단위(기준: .|。|?|!)로 나눈다
    const RIDI = 'RidiDelimiter';
    const split = (text) => text.replace(/([.。?!])/gm, `$1[${RIDI}]`).split(`[${RIDI}]`);

    // '.'이 소수점 또는 영문이름을 위해 사용될 경우 true
    const isPointOrName = (text, nextText) => {
      if (text === undefined || nextText === undefined) {
        return false;
      }
      let hit = 0;
      let index = text.search(/[.](\s{0,})$/gm);
      if (index > 0 && TTSUtil.isDigitOrLatin(text[index - 1])) {
        hit++;
      }
      index = nextText.search(/[^\s]/gm);
      if (index >= 0 && TTSUtil.isDigitOrLatin(nextText[index])) {
        hit++;
      }
      return hit === 2;
    };

    // 문장의 마지막이 아닐 경우 true
    const isNotEndOfSentence =
      (nextText) => nextText !== undefined &&
                  nextText.match(TTSUtil.getSentenceRegex('^')) !== null;

    // Test Code
    const debug = (caseNum) => {
      if (this.debug) {
        const chunk = this.chunks.last;
        console.log(`chunkId: ${chunk.id}, Case: ${caseNum}, Text: ${chunk.getText()}`);
      }
    };

    const chunk = new TTSChunk(pieces);
    const tokens = split(chunk.getText());
    if (tokens.length > 1) {
      let offset = 0;
      let startOffset = 0;
      let subText = '';
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let openBracket;
        let closeBracket;
        let otherBracket;
        subText += token;
        offset += token.length;
        if ((openBracket = TTSUtil.getFirstOpenBracket(token)) !== null) {
          // 괄호의 짝을 맞추지 않고 문장을 나누게 되면 괄호를 읽을 수도 있기 때문에
          // 여는 괄호를 만나면 닫는 괄호를 찾는 과정을 진행한다
          let endLoop = false;
          for (let j = i; j < tokens.length; j++) {
            const nextToken = tokens[j];
            if (i < j) {
              subText += nextToken;
              offset += nextToken.length;
            }
            // TDD - 괄호가 섞였을 때는 어쩔건가 // 예) [{~~~]}
            if ((closeBracket = TTSUtil.getLastCloseBracket(nextToken)) !== null &&
              TTSUtil.isOnePairBracket(openBracket, closeBracket)) {
              if (i === j &&
                nextToken.lastIndexOf(closeBracket) < nextToken.lastIndexOf(openBracket)) {
                // 한 쌍의 괄호는 만들어졌으나 서로 마주 보고 있지 않다
                continue;
              } else if (i < j &&
                (otherBracket = TTSUtil.getFirstOpenBracket(nextToken)) !== null) {
                // 닫는 괄호가 있는 곳에서 새로운 여는 괄호를 만나버렸다 // 예) (~~) ~~ '('~~)
                openBracket = otherBracket;
                if ((otherBracket = TTSUtil.getLastCloseBracket(nextToken)) !== null
                  && TTSUtil.isOnePairBracket(openBracket, otherBracket)) {
                  endLoop = true;
                }
                continue;
              }
              endLoop = true;
            }
            if (isPointOrName(subText, tokens[j + 1]) || isNotEndOfSentence(tokens[j + 1])) {
              // 소수점, 영문 이름을 위한 '.'을 만나거나 문장의 끝을 의미하는 문자가 없을 때는 현재 토큰을 더해주고 과정을 끝낸다
              endLoop = true;
              continue;
            }
            if (endLoop) {
              this.chunks.pushLast(chunk.copy(new TTSRange(startOffset, startOffset + subText.length)));
              subText = '';
              startOffset = offset;
              i = j;
              debug(1);
              break;
            }
          }// end for j
        } else {
          if (isPointOrName(subText, tokens[i + 1]) || isNotEndOfSentence(tokens[i + 1])) {
            // 소수점, 영문 이름을 위한 '.'을 만나거나 문장의 끝을 의미하는 문자가 없을 때는 아직 문장이 끝나지 않았다
            continue;
          }
          if (subText.length) {
            this.chunks.pushLast(chunk.copy(new TTSRange(startOffset, startOffset + subText.length)));
            subText = '';
            debug(2);
          }
          startOffset = offset;
        }
      } // end for i
      if (subText.length) {
        // 루프가 끝나도록 추가되지 못한 애들을 추가한다
        this.chunks.pushLast(chunk.copy(new TTSRange(startOffset, startOffset + subText.length)));
        debug(3);
      }
    } else {
      // piece가 하나 뿐이라 바로 추가한다
      this.chunks.pushLast(chunk);
      debug(4);
    }
  }

  flush() {
    this.processedNodeMaxIndex = -1;
    this._chunks.clear();
  }
}
