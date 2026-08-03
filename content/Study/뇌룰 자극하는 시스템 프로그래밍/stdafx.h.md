pre-compiledHeader 즉 미리 헤더를 컴파일에 해놓는것
자주 사용되는 헤더들, 자주변경되지 않는 헤더들을 미리 모아 컴파일 해놓을수있게 하는것

프로젝트 속성에서 아래와 같이 사용 누름
![[Pasted image 20240316182241.png]]

프로젝트에 stdafx.h stdafx.cpp 생성
![[Pasted image 20240316182311.png]]

stdafx.cpp에 include "stdafx.h "
![[Pasted image 20240316182407.png]]stdafx.h 에 미리 컴파일할 헤더 추가
![[Pasted image 20240316182427.png]]

이러면 컴파일 시간 줄 일 수 있다.
