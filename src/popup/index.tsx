import { useState } from "react"

import "../../style.css"

function IndexPopup() {
  const [labelList, setLabelList] = useState<
    {
      label: string
      href: string
    }[]
  >()
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
    if (!value || value.length < 2) {
      setLabelList([])
      return
    }
    const fetchedLabels: string[] = await fetchStockLabel(value)
    const searchedResults = fetchedLabels.map((fetchedLabel) => {
      return {
        label: fetchedLabel,
        href: `https://kabutan.jp/stock/?code=${fetchedLabel.slice(0, 4)}`
      }
    })
    setLabelList(searchedResults)
  }

  return (
    <div className="w-60 py-2 px-4">
      <input
        type="text"
        onChange={handleChange}
        className="w-full p-1 rounded-md border border-solid border-[#333]"
      />
      {labelList ? (
        <div className="mt-2">
          <ul className="">
            {labelList.map((item) => (
              <li>
                <a
                  className="p-1 pl-2 w-full block rounded-md hover:bg-gray-300"
                  href={item.href}
                  target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default IndexPopup
