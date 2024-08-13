import { useState, type MouseEvent } from "react"

const Search = () => {
  const [labelList, setLabelList] = useState<
    {
      label: string
      ticker: string
    }[]
  >()
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [selectedStockInfo, setSelectedStockInfo] = useState({})
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
    return body
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedLabel("")
    if (!value || value.length < 2) {
      setLabelList([])
      return
    }
    const fetchedLabels: string[] = await fetchStockLabel(value)
    const searchedResults = fetchedLabels
      .filter((fetchLabel) => {
        const ticker = fetchLabel.slice(0, 4)
        return /^\d{4}$/.test(ticker) // 4桁の数値（証券コード）であるか判定
      })
      .map((fetchedLabel) => {
        const ticker = fetchedLabel.slice(0, 4)
        return {
          label: fetchedLabel,
          ticker
        }
      })
    setLabelList(searchedResults)
  }

  const handleLabelClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    ticker: string
  ) => {
    const SELECTED_COLOR = "bg-gray-300"
    if (selectedLabel) {
      document.getElementById(selectedLabel).classList.remove(SELECTED_COLOR)
    }
    e.currentTarget.classList.add(SELECTED_COLOR)
    setSelectedLabel(ticker)
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}.T?range=1y&interval=1mo&events=div`
    const res = await fetch(url)
    const body = await res.json()
    const result = body.chart.result[0]
    console.log(result)
    const dividends = Object.entries(result.events.dividends)
    const data = {
      dividends: [dividends[0][1], dividends[1][1]],
      regularPrice: result.meta.regularMarketPrice
    }
    console.log(data)
    setSelectedStockInfo(data)
  }
  return (
    <>
      <input
        type="text"
        onChange={handleChange}
        className="w-60 p-1 rounded-md border border-solid border-[#333]"
      />
      {labelList ? (
        <div className="mt-2 flex">
          <ul className="w-60">
            {labelList.map((item) => (
              <li key={item.ticker}>
                <button
                  id={item.ticker}
                  className="p-1 pl-2 w-full block text-left rounded-md hover:bg-gray-300"
                  type="button"
                  onClick={(e) => handleLabelClick(e, item.ticker)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          {selectedLabel ? (
            <div className="w-60 ml-3">
              <dl>
                <div className="flex">
                  <dt>株価</dt>
                  <dd>{selectedStockInfo.regularPrice}</dd>
                </div>
                <div className="flex">
                  {/* 一年前の配当 */}
                  <dt>配当（2024/03/01）</dt>
                  <dd>¥{selectedStockInfo.dividends[0].amount}</dd>
                </div>
                <div className="flex">
                  {/* 直近の配当 */}
                  <dt>配当（2024/09/01）</dt>
                  <dd>¥{selectedStockInfo.dividends[1].amount}</dd>
                </div>
                <div className="flex">
                  <dt>配当（合計）</dt>
                  <dd>
                    ¥
                    {selectedStockInfo.dividends[0].amount +
                      selectedStockInfo.dividends[1].amount}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Search
