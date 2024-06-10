const getKoreanDateTime = () => {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(); // UTC + 9시간

    const year = now.slice(0, 4);
    const month = now.slice(5, 7);
    const date = now.slice(8, 10);
    const hours = now.slice(11, 13);
    const minutes = now.slice(14, 16);

    return `${year}-${month}-${date} ${hours}:${minutes}`;
};

module.exports = getKoreanDateTime;
