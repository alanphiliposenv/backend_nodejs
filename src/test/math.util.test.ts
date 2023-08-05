import { when } from "jest-when";
import MathUtil from "../util/math.util";

describe("Test average function", () => {
    test('Test average success', () => {
        const mockedFunction = jest.fn();
        MathUtil.sum = mockedFunction;
        when(mockedFunction).calledWith(4, 4).mockReturnValueOnce(8)
        expect(MathUtil.average(4, 4)).toEqual(4);

    });
    test('Test average fail', () => {
        const mockedFunction = jest.fn();
        MathUtil.sum = mockedFunction;
        when(mockedFunction).calledWith(4, 4).mockReturnValueOnce(8)
        expect(MathUtil.average(4, 4)).not.toEqual(5);
    });
});
