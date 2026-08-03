
멀타바이트캐릭터 셋을 사용하는 경우 영어 숫자는 1바이트 한글은 2바이트 이므로
다음과 같은 문제가 발생함

char ch[] = "ABC한글";
sizeof(ch) => 8바이트
strlen(ch) => 7바이트

typedef unsigned short wchar_t;

모든 문자를 2바이트로 취급 NULL문자도 2바이트

ex)
wchar_t ch = L"ABC한글";

wchar를 사용하는경우 str계열 함수를 사용못함 (strcpy, strlen ...)
대신 wcs계열 함수 사용 (wcscpy, wcslen, wcscat...)

![[Pasted image 20240316161904.png]]
