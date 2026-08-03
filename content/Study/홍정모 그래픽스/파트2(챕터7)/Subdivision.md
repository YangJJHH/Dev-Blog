---
tags:
  - Part2
---
상세도가 낮은 모델을 높은 모델로 생성하는 기술이다.
Subdivision 알고리즘은 다양하게 있는데 여기서는 삼각형 하나당 4개의 삼각형으로 만들어주는 알고리즘을 사용할 것이다.

여기서 중요한점은 Subdivision을 GPU에서 할 수 있다는 것이다.
즉 처음부터 해상도가 높은 모델을 사용하는 것보다 적당한 모델을 GPU에서 Subdivison을 여러번 돌려 더 좋은 성능으로 높은 품질의 모델을 사용할 수 있다.

## 알고리즘 개념
![[Pasted image 20241005203451.png]]v0,v1,v2의 삼각형에서 각각의 중점을 새로 만들어 v3,v4,v5를 생성한다. 해당 정점은 원래의 정점의 vertex,normal,texture등을 평균내어 사용하는 것이다.
이렇게 되면 총 1개의 삼각형에서 4개의 삼각형으로 세분화가 가능하다.

코드는 길지만 사실 별거 없음 
## 코드
```cpp
MeshData GeometryGenerator::SubdivideToSphere(const float radius,
                                              MeshData meshData) {

    using namespace DirectX;
    using DirectX::SimpleMath::Matrix;
    using DirectX::SimpleMath::Vector3;

    // 원점이 중심이라고 가정
    // 입력 받은 구 모델의 반지름 조절
    for (auto &v : meshData.vertices) {
        v.position = v.normal * radius;
    }

    // 구의 표면으로 옮기고 노멀 계산
    auto ProjectVertex = [&](Vertex &v) {
        v.normal = v.position;
        v.normal.Normalize();
        v.position = v.normal * radius;

        // 주의: 텍스춰가 이음매에서 깨집니다.
        // atan vs atan2
        // https://stackoverflow.com/questions/283406/what-is-the-difference-between-atan-and-atan2-in-c
        // const float theta = atan2f(v.position.z, v.position.x);
        // const float phi = acosf(v.position.y / radius);
        // v.texcoord.x = theta / XM_2PI;
        // v.texcoord.y = phi / XM_PI;
    };

    // 버텍스가 중복되는 구조로 구현
    MeshData newMesh;
    uint16_t count = 0;
    for (size_t i = 0; i < meshData.indices.size(); i += 3) {
        size_t i0 = meshData.indices[i];
        size_t i1 = meshData.indices[i + 1];
        size_t i2 = meshData.indices[i + 2];

        Vertex v0 = meshData.vertices[i0];
        Vertex v1 = meshData.vertices[i1];
        Vertex v2 = meshData.vertices[i2];

        Vertex v3;
        // 위치와 텍스춰 좌표 결정
        Vector3 halfPos = (v2.position - v0.position) * 0.5f;
        Vector2 halfTex = (v2.texcoord - v0.texcoord) * 0.5f;
        v3.position = v0.position + halfPos;
        v3.texcoord = v0.texcoord + halfTex;

        Vertex v4;
        // 위치와 텍스춰 좌표 결정
        halfPos = (v1.position - v0.position) * 0.5f;
        halfTex = (v1.texcoord - v0.texcoord) * 0.5f;
        v4.position = v0.position + halfPos;
        v4.texcoord = v0.texcoord + halfTex;

        Vertex v5;
        // 위치와 텍스춰 좌표 결정
        halfPos = (v2.position - v1.position) * 0.5f;
        halfTex = (v2.texcoord - v1.texcoord) * 0.5f;
        v5.position = v1.position + halfPos;
        v5.texcoord = v1.texcoord + halfTex;

        ProjectVertex(v3);
        ProjectVertex(v4);
        ProjectVertex(v5);

        // 모든 버텍스 새로 추가
        newMesh.vertices.push_back(v0);
        newMesh.vertices.push_back(v4);
        newMesh.vertices.push_back(v3);

        newMesh.vertices.push_back(v4);
        newMesh.vertices.push_back(v1);
        newMesh.vertices.push_back(v5);

        newMesh.vertices.push_back(v3);
        newMesh.vertices.push_back(v5);
        newMesh.vertices.push_back(v2);

        newMesh.vertices.push_back(v3);
        newMesh.vertices.push_back(v4);
        newMesh.vertices.push_back(v5);

        // 인덱스 업데이트
        for (uint16_t j = 0; j < 12; j++) {
            newMesh.indices.push_back(j + count);
        }
        count += 12;
    }

    return newMesh;
}
```

## 실행결과
Subdivision 전
![[Pasted image 20241005205330.png]]

Subdivision 2번 적용한 후
![[Pasted image 20241005205405.png]]