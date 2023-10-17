import { Modal } from "native-base"
import { Searchbar } from "react-native-paper";


const FilterModal = ({ filters, showModal, setShowModal }) => {
    

    return (
        <Modal isOpen={showModal} onClose={setShowModal} size="md">
            <Modal.CloseButton></Modal.CloseButton>
            <Modal.Header>
                Filters
            </Modal.Header>
            <Modal.Body>
                <Searchbar
                    placeholder="Search"
                    onChangeText={(value) => filters.query = value.trim()}
                    
                />
            </Modal.Body>
        </Modal>
    )
}

export default FilterModal;