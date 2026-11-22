import React from "react";
import { Composition } from "remotion";
import { FORMATS, PostFilm } from "./Post";
import { Post } from "./types";
import posts from "../content/posts.json";

const first = (posts as Post[])[0];

export const Root: React.FC = () => (
  <Composition
    id="Post"
    component={PostFilm}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={300}
    defaultProps={{ p: first }}
    calculateMetadata={({ props }) => ({ durationInFrames: FORMATS[props.p.format].duration(props.p) })}
  />
);
