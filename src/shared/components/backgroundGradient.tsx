import Svg, {Defs, RadialGradient, Stop, Rect,} from "react-native-svg";


export function BackgroundGradient() {
  return (
    <Svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
      }}
    >
      <Defs>

        <RadialGradient
          id="verde"
          cx="85%" // pro lado
          cy="10%" // pra cima ou pra baixo
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="#C6FF34"
            stopOpacity="0.3"
          />
          <Stop
            offset="100%"
            stopColor="#B7FF00" 
            stopOpacity="0"
          />
        </RadialGradient>

        <RadialGradient
          id="roxo"
          cx="10%"
          cy="90%"
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="#462680" 
            stopOpacity="0.4"
          />
          <Stop
            offset="100%"
            stopColor="#7E3BED"
            stopOpacity="0"
          />
        </RadialGradient>

      </Defs>

      <Rect
        width="100%"
        height="100%"
        fill="#09090B"
      />

      <Rect
        width="100%"
        height="100%"
        fill="url(#roxo)"
      />

      <Rect
        width="100%"
        height="100%"
        fill="url(#verde)"
      />
    </Svg>
  );
}