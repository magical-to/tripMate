// import decode from 'jwt-decode'; 

// // 토큰 유효성 확인 함수
// export const isTokenValid = (token) => {
//   if (!token) return false; // 토큰이 없으면 무효

//   try {
//     const decodedToken = decode(token); // decode 함수 사용
//     const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

//     return decodedToken.exp && decodedToken.exp > currentTime;
//   } catch (error) {
//     return false; // 토큰 디코딩 실패 시 무효
//   }
// };
