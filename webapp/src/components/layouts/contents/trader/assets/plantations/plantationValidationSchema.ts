import * as Yup from "yup";

const plantationValidationSchema = Yup.object().shape({

	management: Yup.object().shape({
		type: Yup.string().required("Required"),
		name: Yup.string().when('type', {
			is: value => value === "Pribadi",
			then: Yup.string().notRequired(),
			otherwise: Yup.string().required('Required'),
		}),
		detail: Yup.string().when('type', {
			is: value => value === "Lainnya",
			then: Yup.string().required('Required'),
			otherwise: Yup.string().notRequired(),
		}),
		rep: Yup.string().when('type', {
			is: value => value === "Pribadi",
			then: Yup.string().notRequired(),
			otherwise: Yup.string().required('Required'),
		}),
		contact: Yup.string().when('type', {
			is: value => value === "Pribadi",
			then: Yup.string().notRequired(),
			otherwise: Yup.string().required('Required'),
		}),
	}),

	certification: Yup.object().shape({
		type: Yup.string().required("Required"),
		detail: Yup.string().when('type', {
			is: value => value === "Lainnya",
			then: Yup.string().required('Required'),
			otherwise: Yup.string().notRequired(),
		}),
		serial: Yup.string().required("Required"),
	}),

	license: Yup.object().shape({
		area: Yup.number()
			.moreThan(0, "Number must be more than 0")
			.required("Required"),
		type: Yup.string().when('area', {
			is: value => value > 25,
			then: Yup.string().required('Required'),
			otherwise: Yup.string().notRequired(),
		}),
		detail: Yup.string().when('type', {
			is: value => value === "Lainnya",
			then: Yup.string().required('Required'),
			otherwise: Yup.string().notRequired(),
		}),
	}),

	previousLandCover: Yup.object().shape({
		type: Yup.string().required("Required"),
		detail: Yup.string().when('type', {
			is: value => value === "Lainnya",
			then: Yup.string().required('Required'),
			otherwise: Yup.string().notRequired(),
		}),
	}),
	age: Yup.number()
		.moreThan(0, "Number must be more than 0")
		.required("Required"),
	treesPlanted: Yup.number()
		.moreThan(0, "Number must be more than 0")
		.required("Required"),
	treesProductive: Yup.number()
		.moreThan(0, "Number must be more than 0")
		.required("Required"),
	aveMonthlyYield: Yup.number()
		.moreThan(0, "Number must be more than 0")
		.required("Required"),
	landClearingMethod: Yup.string()
		.required("Required"),
	plantationName: Yup.string()
		.required("Required")
});

export default plantationValidationSchema;