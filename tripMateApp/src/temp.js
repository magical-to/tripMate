export const getAddressByKeyword = async (keyword) => {
    return new Promise((res, rej) => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            console.log(data)
        res(data[0].address_name)
      });
    })
}