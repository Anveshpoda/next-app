import { useEffect, useState } from "react"
import SelectField from "../UI/Form/select"
import InputField from "../UI/inputField"
import { sessionData } from "@/utils/fun"

const ApiPop = ({ show, onClose, ...props }) => {

    const closePopup = () => { onClose && onClose(false) }
    if (show != undefined && !show) return ''

    const [formData, setFormData] = useState({ mobile: '', docId: '', user_type: 'owner', compDetails: '0', rsvnInfo: '0', multiDocData: '0', eid: '', ename: '', host: '', })
    const [loading, setLoading] = useState(false);
    const [more, setMore] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const queryString = new URLSearchParams({
            mobile: formData.mobile,
            docId: formData.docId,
            user_type: formData.user_type,
            compDetails: formData.compDetails,
            rsvnInfo: formData.rsvnInfo,
            multiDocData: formData.multiDocData,
            ename: formData.ename,
            eid: formData.eid,
            host: formData.host,
        });
        sessionData('apiData', formData)
        closePopup();
        window.open(`https://staging2.justdial.com/online-consult/api/compDataByMobile?${queryString.toString()}`, '_blank');
    };

    useEffect(() => {
        let fd = sessionData('apiData')
        if (fd) setFormData({ ...formData, ...fd })
    }, [])


    return (
        <>
            <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 ">
                    <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.8)]" onClick={() => closePopup('outside')}> </div>
                    <div className={`w-full min-h-[300px] relative transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg  delay-75 transition-all animate-blowUp`}>
                        <div className="w-full">
                            <span className="pop_closeicn absolute right-1 top-1" onClick={() => closePopup('cross')}> </span>

                            <div className="bg-white shadow-lg rounded-lg p-8 w-full">
                                <h1 className="text-2xl font-bold mb-5 text-gray-800">API Caller</h1>

                                {/* Flex container: stacks vertically on mobile and side-by-side on md+ */}
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Form Section */}
                                    <form onSubmit={handleSubmit} className="flex-1 min-w-[400px] max-w-[600px]">
                                        <div className="mt-0 pt-0 text-[#7e7e7e]">* Mobile number or DocID is required.</div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <InputField label="Doc ID" type="text" name="docId" id="docId" value={formData.docId} onChange={handleChange} />
                                            <InputField label="Mobile" type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} />
                                            {more && <>
                                                <InputField label="User Type" info="UserType = owner | user | me | jde | de" type="text" name="user_type" id="user_type" value={formData.user_type} onChange={handleChange} />

                                                <div className="grid grid-cols-3 gap-4 pt-1">
                                                    <SelectField label="Comp Details" type="text" name="compDetails" id="compDetails" value={formData.compDetails} onChange={handleChange}                                                >
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                    </SelectField>
                                                    <SelectField
                                                        label="Rsvn Info" type="text" name="rsvnInfo" id="rsvnInfo" value={formData.rsvnInfo} onChange={handleChange}                                                >
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                    </SelectField>
                                                    <SelectField label="Multi Doc Data" type="text" name="multiDocData" id="multiDocData" value={formData.multiDocData} onChange={handleChange}                                                >
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                    </SelectField>
                                                </div>

                                                <InputField label="EID" type="number" name="eid" id="eid" value={formData.eid} onChange={handleChange} />
                                                <InputField label="Emp Name" type="text" name="ename" id="ename" value={formData.ename} onChange={handleChange} />
                                                <InputField label="Host" type="text" name="host" id="host" value={formData.host} onChange={handleChange} /></>}
                                        </div>

                                        <div onClick={() => setMore(prev => !prev)} className="cursor-pointer mt-2 ml-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200" aria-expanded={more} >
                                            {more ? "Less Options" : "More Options"}
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            {loading ? 'Loading...' : 'Call API'}
                                        </button>
                                    </form>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div >

            <style jsx>
                {`  
                .pop_closeicn {background:url(https://akam.cdn.jdmagicbox.com/images/icontent/newwap/editnew/modal_closeicn.svg) no-repeat;background-position: center; width:25px;height:25px; display:inline-flex;cursor: pointer;}
                .animate-blowUp {	animation: blowUp 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
                    @keyframes blowUp { 
                        0% { transform:scale(0); opacity:0; }
                        100% { transform:scale(1); opacity:1; }
                    }
                }
            `}

            </style>
        </>
    )
}

export default ApiPop