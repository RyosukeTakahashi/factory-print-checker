import styled from "styled-components";
import { useRecoilValue } from "recoil";
import {
  clickedAreasAtom,
  gridLengthAtom,
  labelImgUrlAtom,
} from "../src/atoms";

const GridLayout = styled.div`
  margin-left: 30px;
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
  border: 0.5px dashed blue;
  user-select: none;
`;

export default function AnnotatedImage({}: {}) {
  const gridLength = useRecoilValue(gridLengthAtom);
  const imgUrl = useRecoilValue(labelImgUrlAtom);
  const clickedAreas = useRecoilValue(clickedAreasAtom);

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
