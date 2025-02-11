import Modal from "./Modal";

const SaveCred = () => {
    return (
        <>
            <Modal>
                <h1 className="text-2xl font-bold mb-5 text-gray-800">API Caller</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <form onSubmit={handleSubmit} className="flex-1 min-w-[400px] max-w-[600px]">


                    </form>
                </div>
            </Modal>
        </>
    )
}

export default SaveCred;