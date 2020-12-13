import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { clickedAreasAtom, correctGridsAtom } from "../src/atoms";

export const AnswerResultTable: FC = () => {
  const correctGrids = new Set(useRecoilValue(correctGridsAtom));
  const clickedAreas = new Set(useRecoilValue(clickedAreasAtom));

  //正解かつ選ばれた
  const truePositive = new Set(
    // @ts-ignore
    [...correctGrids].filter((e) => clickedAreas.has(e)) //積集合
  );

  //選ばれたが、不正解（選択不要だったグリッド）
  const falsePositive = new Set(
    // @ts-ignore
    [...clickedAreas].filter((e) => !correctGrids.has(e)) //差集合
  );

  //選択されてなかったが、選択が必要だったグリッド
  const falseNegative = new Set(
    // @ts-ignore
    [...correctGrids].filter((e) => !clickedAreas.has(e))
  );

  const noWrongAnswer = falsePositive.size === 0 && falseNegative.size === 0;

  const answerMessage = () => {
    if (truePositive.size === clickedAreas.size && noWrongAnswer) {
      return "マス：正解です。";
    }
    if (truePositive.size > 0 && !noWrongAnswer) {
      return "マス：一部正解です。";
    }
    if (truePositive.size === 0 && !noWrongAnswer) {
      return "マス：不正解です。";
    }
  };

  return (
    <>
      <div className={"text-3xl"}>{answerMessage()}</div>
      {!(truePositive.size === clickedAreas.size && noWrongAnswer) && (
        <div>
          選ばれるべき{correctGrids.size}個のマスのうち、{truePositive.size}個
          が選ばれました。
        </div>
      )}
      {falsePositive.size > 0 && (
        <div>
          余計に選んでしまったマスが、{falsePositive.size}個ありました。
        </div>
      )}
      {falseNegative.size > 0 && (
        <div>追加で選ぶべきマスが、{falseNegative.size}個ありました。</div>
      )}
    </>
  );
};
