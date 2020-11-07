import Head from "next/head";
import RefOrInj from "../components/RefOrInj";
import Squares from "../components/Squares";
import { AppLayoutGrid, Pane } from "../src/constants";
import LeftPane from "../components/LeftPane";

// フォルダ選択
// 画像反映

// fetcher 記述
// getserversideprops でcsvを取得
// machine check result
// getchoice
// getrecoveryoptions
// getDownloadUrlsOfImgInFolder
//

export default function Home({}: {}) {
  return (
    <>
      <Head>
        <title>{"印刷チェッカー"}</title>
      </Head>
      <AppLayoutGrid>
        <LeftPane />
        <Pane area={"centerPane"}>
          <main className={"flex justify-around"}>
            <RefOrInj />
            <Squares />
          </main>
        </Pane>
      </AppLayoutGrid>
    </>
  );
}
