---
tags:
  - Part2
---

Rasterization에서의 원근투영 구현 개념
![[Pasted image 20240820215356.png]]우선 개념은 물체의 월드상 Vertice를 시점 방향대로 화면에 투영시키는 것이다.


옆에서 보면 아래와 같고, 삼각형의 비례식을 이용하여 식을 유도 할 수 있다.
![[Pasted image 20240820220205.png]]

그러면 코드상에서 ProjectWorldToRaster()에서 좌표를 원근투영일경우 아래와 같이 구할 수 있음
```cpp
vec2 Rasterization::ProjectWorldToRaster(vec3 pointWorld) {

    // 월드 좌표계의 원점이 우리가 보는 화면의 중심이라고 가정

    // 정투영(Orthographic projection)
    vec2 pointProj = vec2(pointWorld.x, pointWorld.y);

    // 원근투영(Perspective projection)
    if (this->usePerspectiveProjection) {
        pointProj.x = distEyeToScreen * pointWorld.x / (distEyeToScreen + pointWorld.z);
           
        pointProj.y = distEyeToScreen * pointWorld.y / (distEyeToScreen + pointWorld.z);
    }

    // NDC로 변환[-1, 1] x[-1, 1]
    // NDC(Normalized Device Coordinates)
    // NDC는 모니터의 실제 해상도와 상관 없이 정사각형이라는 점 주의
    // 그림: http://www.directxtutorial.com/Lesson.aspx?lessonid=111-4-1
    // 여기서는 width가 height보다 긴 경우만 고려

    const float aspect = float(width) / height;
    const vec2 pointNDC = vec2(pointProj.x / aspect, pointProj.y);

    // 레스터 좌표의 범위 [-0.5, width - 1 + 0.5] x [-0.5, height - 1 + 0.5]
    const float xScale = 2.0f / width;
    const float yScale = 2.0f / height;

    // NDC -> 레스터 화면 좌표계
    // 주의: y좌표 상하반전
    return vec2((pointNDC.x + 1.0f) / xScale - 0.5f,
                (1.0f - pointNDC.y) / yScale - 0.5f);
}
```

원근 투영한 결과
![[Pasted image 20240820221648.png]]
결과를 보면 레이트레이싱으로 원근투영했을 경우와 다르게 왜곡이 일어나는것을 볼 수 있다.


![[Pasted image 20240821004944.png]]
A,B를 화면에 투영시키고나서 A',B'에 대해 Bary-CentricCoordinate Interpolate을 진행하여 k'을 구하 기 떄문에 위와 같은 현상이 나타난다. 실제 월드상 좌표 A,B를 대해 Interpoltate을 하는 것과 이미 투영된 점에 대해 Interpolate을 하는 결과가 원근 투영에서는 다르게 나타나는데 그 이유는 z값이 다르기 때문이다.(그래서 직교 투영에서는 투영된 점에 Interpolate을 해서 구해도 왜곡이 안일어남)

해결방법
![[Pasted image 20240821005749.png]]원래 Bary-Centric Coordinates을 이용하여 구한 값에 시점으로부터 실제 vertex의 월드상 z거리를 더해서 나누어주어 식에 반영하게 되면 해결된다.

```cpp
				const float z0 = this->vertexBuffer[i0].z + distEyeToScreen;
                const float z1 = this->vertexBuffer[i1].z + distEyeToScreen;
                const float z2 = this->vertexBuffer[i2].z + distEyeToScreen;

                if (this->usePerspectiveProjection &&
                    this->usePerspectiveCorrectInterpolation) {

                    // w0, w1, w2를 z0, z1, z2를 이용해서 보정
                    w0 = w0 / z0;
                    w1 = w1 / z1;
                    w2 = w2 / z2;

                    
                }
                const auto total = w0 + w1 + w2;
                w0 = w0 / total;
                w1 = w1 / total;
                w2 = w2 / total;
```

왜곡현상 해결
![[Pasted image 20240821011638.png]]