function ajax(type = "POST", option = { api: "/sendData" }) {
  const xhr = new XMLHttpRequest();
  xhr.open(type, option.api, true);
  xhr.onreadystatechange = function (e) {};
  xhr.send(
    JSON.stringify({
      test: "name123123",
    })
  );
}

export default ajax;
