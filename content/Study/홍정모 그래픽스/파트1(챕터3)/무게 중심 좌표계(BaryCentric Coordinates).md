---
tags:
  - Part1
---

## Linear Interpolation
![[Pasted image 20240811165751.png]]

위와 비슷한 원리로 삼각형의 색깔을 보간하는법
점 p를 기준으로 3각형 3개로 나누고 각 넓이의 비로 보간정도를 적용한다.
점에 가까워질수록 점에 맞은편 삼각형의 넓이가 커지는 원리.
![[Pasted image 20240811170919.png]]

```cpp
bool IntersectRayTriangle(const vec3 &orig, const vec3 &dir,
                                  const vec3 &v0, const vec3 &v1,
                                  const vec3 &v2, vec3 &point, vec3 &faceNormal,
                                  float &t, float &w0, float &w1)
        {
            /*
             * 기본 전략
             * - 삼각형이 놓여있는 평면과 광선의 교점을 찾고,
             * - 그 교점이 삼각형 안에 있는지 밖에 있는지를 판단한다.
             */

            /* 1. 삼각형이 놓여 있는 평면의 수직 벡터 계산 */
            faceNormal = glm::normalize(glm::cross(v1 - v0, v2 - v0));
            //주의: 삼각형의 넓이가 0일 경우에는 계산할 수 없음

            // 삼각형 뒷면을 그리고 싶지 않은 경우 (Backface culling)
            if (dot(-dir, faceNormal) < 0.0f)
                return false;

            // 평면과 광선이 수평에 매우 가깝다면 충돌하지 못하는 것으로 판단
            if (glm::abs(dot(dir, faceNormal)) < 1e-2f)
                return false; // t 계산시 0으로 나누기 방지

            /* 2. 광선과 평면의 충돌 위치 계산 */
            t = (dot(v0, faceNormal) - dot(orig, faceNormal)) /
                (dot(dir, faceNormal));

            // 광선의 시작점 이전에 충돌한다면 렌더링할 필요 없음
            if (t < 0.0f)
                return false;

            point = orig + t * dir; // 충돌점

            /* 3. 그 충돌 위치가 삼각형 안에 들어 있는 지 확인 */

            // 작은 삼각형들 3개의 normal 계산
            // 방향만 확인하면 되기 때문에 normalize() 생략 가능
            const vec3 cross0 = glm::cross(point - v2, v1 - v2);
            const vec3 cross1 = glm::cross(point - v0, v2 - v0);
            const vec3 cross2 = glm::cross(v1 - v0, point - v0);

            if (dot(cross0, faceNormal) < 0.0f)
                return false;
            if (dot(cross1, faceNormal) < 0.0f)
                return false;
            if (dot(cross2, faceNormal) < 0.0f)
                return false;

            // Barycentric coordinates 계산
            // 텍스춰링(texturing)에서 사용
            // 아래에서 cross product의 절대값으로 작은 삼각형들의 넓이 계산
            const float area0 = glm::length(cross0) * 0.5f;
            const float area1 = glm::length(cross1) * 0.5f;
            const float area2 = glm::length(cross2) * 0.5f;

            const float areaSum = area0 + area1 + area2;

            // 기호에 alpha, beta, gamma 또는 u, v, w 등을 사용하기도 함
            w0 = area0 / areaSum;
            w1 = area1 / areaSum;

            return true;
        }
```

실행결과
![[Pasted image 20240811173231.png]]