function IndexPopup() {
  const handleClick = async () => {
    const urlParams = new URLSearchParams()
    urlParams.append("q", "jt")
    const params = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      body: urlParams
    }
    const res = await fetch("https://kabutan.jp/pulldown/", params)
    const body = await res.json()
    console.log(body)
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>
        push
      </button>
    </div>
  )
}

export default IndexPopup
