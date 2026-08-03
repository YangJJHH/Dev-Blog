---
tags:
  - Part2
---
이번엔 노멀벡터가 랜더링에 결과 어떻게 영향을 주는지 확인해본다.
기존에 정점마다의 계산된 노멀벡터를 자기가 포함된 면(face)의 노멀벡터로 바꾸어 같은 점이라도 다른 면이라면 다른 노멀벡터를 갖도록 해본다.

```cpp
    auto UpdateFaceNormal = [](Vertex &v0, Vertex &v1, Vertex &v2) {

        // v0, v1, v2로 이루어진 삼각형의 faceNormal 계산
        auto faceNormal = (v1.position -v0.position).Cross(v2.position - v0.position);
        faceNormal.Normalize();
        v0.normal = faceNormal;
        v1.normal = faceNormal;
        v2.normal = faceNormal;
    };
```
기존의 노멀을 v1-v0, v2-v0 의 외적 즉 현재 삼각형의 노멀벡터로 저장해준다.

## VertexNormal
![[Pasted image 20241005205907.png]]

## FaceNormal
![[Pasted image 20241005210928.png]]