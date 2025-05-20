import { useParams } from "react-router-dom";
import CanvasIntersection from "../components/experements/ex1";
import Ex2 from "../components/experements/ex2";
import Ex3 from "../components/experements/ex3";
import Ex4 from "../components/experements/ex4";
import Ex5 from "../components/experements/ex5";
import Ex6 from "../components/experements/ex6/ex6";

export default function Expement() {
  const { id } = useParams();

  switch (id) {
    case '1':
      return (<CanvasIntersection />);
    case '2':
      return (<Ex2 />);
    case '3':
      return (<Ex3 />);
    case '4':
      return (<Ex4 />);
    case '5':
      return (<Ex5 />);
    case '6':
      return (<Ex6 />);
      
  }
}
