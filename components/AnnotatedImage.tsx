import styled from "styled-components";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  clickedAreasAtom, correctGridsAtom,
  gridLengthAtom, imgPathAtom,
  labelImgUrlAtom,
} from "../src/atoms";

const GridLayout = styled.div`
  margin-left: 30px;
  display: grid;
  width: 512px;
  height: 512px;
  grid-template-columns: repeat(${(props) => props.gridLength}, 1fr);
  background-image: url(${(props) => props.imgUrl});
  background-repeat: no-repeat;
  background-size: cover;
`;

const Area = styled.div`
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  border: ${(props) =>
    props.isAreaClicked ? "1px solid red" : "1px dashed blue"};
  user-select: none;
`;

export default function AnnotatedImage({}: {}) {
  const gridLength = useRecoilValue(gridLengthAtom);
  const imgUrl = useRecoilValue(labelImgUrlAtom);
  const correctGrids = useRecoilValue(correctGridsAtom);

  const areas = Array.from({ length: gridLength }).map((_, i) => {
    return Array.from({ length: gridLength }).map((_, j) => {
      const row = i + 1;
      const column = j + 1;
      const nthGrid = i * gridLength + column;
      const isAreaClicked = correctGrids.includes(nthGrid);
      return (
        <Area
          column={column}
          row={row}
          key={nthGrid}
          isAreaClicked={isAreaClicked}
        />
      );
    });
  });

  return (
    <GridLayout
      gridLenth={gridLength}
      imgUrl={imgUrl}
      className={"flex-initial"}
    >
      {areas}
    </GridLayout>
  );
}
