
const Modal = ({ title, message, show, onClose, pBTxt, pBClass, sBClass, sBTxt, disablePB, disableSB, pBClick, tBType, sBType, sBClick, tBClick, children, bottomContent, tBText, className, fullWidth, titleClass, hideClose = false, disableOutClick = false, modalClass = '', ...props }) => {

    const closePopup = () => { onClose && onClose(false) }
    if (show != undefined && !show) return ''

    return (
        <>
            <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 ">
                    <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.8)]" onClick={() => !(disableOutClick || hideClose) && closePopup('outside')}> </div>
                    <div className={`${modalClass} w-full min-h-[200px] relative transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg  delay-75 transition-all animate-blowUp`}>
                        {(title || !hideClose) && <div className={`${title ? 'px-3 py-2.5 border-b-[1px] border-color-[#f6f6f6]' : 'px-1 py-1'}  items-center flex`}>
                            <div className={`flex-1 font-semibold ${titleClass} ${props.centerTitle && 'flex justify-center items-center'}`}>{title}</div>
                            {!hideClose && <span className="pop_closeicn" onClick={() => closePopup('cross')}> </span>}
                        </div>}
                        <div className="w-full px-3.5 py-3.5 cp">
                            <div className="flex-1 pl-5 font-medium">{message}</div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

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

export default Modal