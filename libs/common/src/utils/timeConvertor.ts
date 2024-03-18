export const StartedUnixTimestamp = (t: number) => {
  t *= 1000;
  const date = new Date(t);
  const year = date.getFullYear();
  const month = '0' + (date.getMonth() + 1);
  const day = '0' + date.getDate();
  const hour = '0';
  const minute = '0';
  const second = '0';
  console.log(date);
  console.log(year);
  console.log(month);
  console.log(day);
  return (
    year +
    '-' +
    month.substr(-2) +
    '-' +
    day.substr(-2) +
    ' ' +
    hour.substr(-2) +
    ':' +
    minute.substr(-2) +
    ':' +
    second.substr(-2)
  );
};

export const EndedUnixTimestamp = (t: number) => {
  t *= 1000;
  const date = new Date(t);
  const year = date.getFullYear();
  const month = '0' + (date.getMonth() + 1);
  const day = '0' + date.getDate();
  const hour = '23';
  const minute = '59';
  const second = '59';
  return (
    year +
    '-' +
    month.substr(-2) +
    '-' +
    day.substr(-2) +
    ' ' +
    hour.substr(-2) +
    ':' +
    minute.substr(-2) +
    ':' +
    second.substr(-2)
  );
};

export const UnixTimestamp = (t: number) => {
  const date = new Date(t * 1000);
  const year = date.getFullYear();
  const month = '0' + (date.getMonth() + 1);
  const day = '0' + date.getDate();
  const hour = '0' + date.getHours();
  const minute = '0' + date.getMinutes();
  const second = '0' + date.getSeconds();

  return (
    year +
    '-' +
    month.substr(-2) +
    '-' +
    day.substr(-2) +
    ' ' +
    hour.substr(-2) +
    ':' +
    minute.substr(-2) +
    ':' +
    second.substr(-2)
  );
};
