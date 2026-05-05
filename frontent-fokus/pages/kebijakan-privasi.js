import { getKebijakanPrivacy, getTermsCondition } from "@/lib/axios/landing";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";

export default function KebijakanPrivacy(){
    const [privasi, setPrivasi] = useState("");
    
    const fetchPrivasi = useCallback(async () => {
        try {
        const result = await getKebijakanPrivacy()
        setPrivasi(result.data?.properties?.privacy||"");
        } catch (err) {
        console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchPrivasi();
    }, [fetchPrivasi]);
    return (
        <div className="px-7 mt-3 font-poppins">
            <header className="flex mx-3.5 space-x-2 text-xs">
                <p>Tentang</p><span>›</span><p>Kebijakan & Privasi</p>
            </header>
            <div className="w-full text-sm">
                {privasi&&(
                    <div
                    className="prose max-w-none ql-editor"
                    dangerouslySetInnerHTML={{ __html: privasi }}
                    />
                )}
           </div>
        </div>
    )
}