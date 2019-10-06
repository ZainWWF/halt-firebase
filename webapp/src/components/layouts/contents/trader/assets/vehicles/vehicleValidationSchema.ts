import * as Yup from "yup";

const vehicleValidationSchema = Yup.object().shape({
	make: Yup.string()
		.required("Required"),
	model: Yup.string()
		.required("Required"),
	loadingCapacity: Yup.number()
		.moreThan(0)
		.required("Required"),
	license: Yup.string()
		.required("Required"),
	colour: Yup.string()
		.required("Required"),

});

export default vehicleValidationSchema