import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  clickedAreasAtom,
  gridLengthAtom,
  targetImgUrlAtom,
} from "../src/atoms";

const GridLayout = styled.div`
  display: grid;
  width: 350px;
  height: 350px;
  grid-template-columns: repeat(${(props) => props.gridLength}, 1fr);
  background-image: url(${(props) => props.imgUrl});
  background-repeat: no-repeat;
  background-size: cover;
`;

const Area = styled.div`
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  border: ${(props) =>
    props.isAreaClicked ? "0.5px solid red" : "0.5px dashed blue"};
  user-select: none;
`;

export default function Squares({}: {}) {
  const gridLength = useRecoilValue(gridLengthAtom);
  const imgUrl = useRecoilValue(targetImgUrlAtom);
  const [clickedAreas, setClickedAreas] = useRecoilState(clickedAreasAtom);
  const handleOnClick = (nthGrid) => () => {
    const newClickedAreas = (() => {
      if (!clickedAreas.includes(nthGrid)) {
        return clickedAreas.concat([nthGrid]);
      } else {
        return clickedAreas.filter((element) => element !== nthGrid);
      }
    })();
    setClickedAreas(newClickedAreas);
  };

  const areas = Array.from({ length: gridLength }).map((_, i) => {
    return Array.from({ length: gridLength }).map((_, j) => {
      const row = i + 1;
      const column = j + 1;
      const nthGrid = i * gridLength + column;
      const isAreaClicked = clickedAreas.includes(nthGrid);
      return (
        <Area
          column={column}
          row={row}
          key={nthGrid}
          isAreaClicked={isAreaClicked}
          onClick={handleOnClick(nthGrid)}
        />
      );
    });
  });

  return (
    <GridLayout
      gridLenth={gridLength}
      imgUrl={imgUrl}
      onClick={handleOnClick}
      className={"flex-initial"}
    >
      {areas}
    </GridLayout>
  );
}
