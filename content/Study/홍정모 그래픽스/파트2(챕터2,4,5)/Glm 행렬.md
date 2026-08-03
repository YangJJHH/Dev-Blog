---
tags:
  - Part2
---
다이렉트x에서 기본적으로 RowMajor 벡터를 사용한다.
하지만 glm은 Column Major이기 때문에 주의

2x2 행렬을 만드는법
```cpp
// glm::mat2 (2x2 column-major matrix)
    mat2 A = mat2(1, 2, 3, 4);

    cout << to_string(A) << endl;
    // mat2x2((1.000000, 2.000000),
    //        (3.000000, 4.000000))
    // 우리가 생각하는 행렬 (column-major)
    // |1 3|
    // |2 4|
```

전치행렬
```cpp
cout << to_string(transpose(A)) << endl;
    // mat2x2((1.000000, 3.000000),
    //        (2.000000, 4.000000))
```

A[1]을 출력하면 glm은 컬럼메이저이기 때문에 1인 컬럼이 나온다.
```cpp
cout << to_string(A[1]) << endl;
    // vec2(3.000000, 4.000000)
```

예시로 glm을 통해 변환행렬 구하는법
Column메이저이기 때문에 순서가 다음과 같은 t * r * s 
```cpp
 constants.modelMatrix =
	translate(mesh->transformation.translation) *
	rotate(mesh->transformation.rotationX, vec3(1.0f, 0.0f, 0.0f)) *
	rotate(mesh->transformation.rotationY, vec3(0.0f, 1.0f, 0.0f)) *
	glm::scale(mesh->transformation.scale);

	// Non-uniform scale인 경우에만 필요
	constants.invTranspose = glm::inverse(transpose(constants.modelMatrix));
```
