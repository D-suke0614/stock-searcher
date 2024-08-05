import { useState } from "react"

function IndexPopup() {
  const [labels, setLabels] = useState<string[]>()
  const urlSearchParam = new URLSearchParams()

  const fetchStockLabel = async (value: string) => {
    urlSearchParam.append("q", value)
    const params = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      body: urlSearchParam
    }
    const res = await fetch("https://kabutan.jp/pulldown/", params)
    const body: string[] = await res.json()
    console.log(body)
    return body
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value || value.length < 2) return
    const fetchedLabels: string[] = await fetchStockLabel(value)
    setLabels(fetchedLabels)
  }

  return (
    <div>
      <input type="text" onChange={handleChange} />
      {/* <button type="button" onClick={handleClick}>
        push
      </button> */}
    </div>
  )
}

export default IndexPopup
