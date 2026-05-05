const BannerBeli =()=>{
    return (
        <>
            <div className="my-5 p-7 bg-dark-primary w-full flex flex-col space-y-2 sm:flex-row justify-between rounded-md">
                <div className="text-white">
                    <h1 className="text-xl">Beli dan akses seluruh materi</h1>
                    <h2 className="text-xs">Mulai dari Rp 19.900/bulan</h2>
                </div>
                <button className="text-xs text-primary px-6 py-3 sm:py-0 bg-white rounded-md">Beli Paket</button>
            </div>
        </>
    )
}

export default BannerBeli;