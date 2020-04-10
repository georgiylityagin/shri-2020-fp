/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  prop,
  anyPass,
  lt,
  __,
  gt,
  length,
  applySpec,
  mathMod,
  partial,
  pipe,
  last,
  juxt,
  identity,
  pipeWith} from 'ramda';

const api = new Api();


const processSequence = async (obj) => {
  const string = prop('value');
  const writeLog = prop('writeLog', obj);
  const handleSuccess = prop('handleSuccess', obj);
  const handleError = prop('handleError', obj);
  const isNaN = prop('isNaN', Number);
  const round = prop('round', Math);
  const pow = prop('pow', Math);
  const get = prop('get', api);
  const getResultProp = prop('result');

  const sqr = partial(pow, [2]);
  const mathMod3 = mathMod(__, 3);
  const sideWriteLog = pipe(juxt([writeLog, identity]), last);
  const checkMaxlength = gt(__, 9);
  const checkMinLength = lt(__, 3);
  const isNegative = lt(__, 0);
  const isTooLong = pipe(length, checkMaxlength);
  const isTooShort = pipe(length, checkMinLength);
  const isNotNumber = pipe(Number, isNaN);
  const isError = anyPass([isNegative, isTooLong, isTooShort, isNotNumber]);
  const validationLogic = pipe(string, sideWriteLog, isError);

  const constructRequestParams = applySpec({
    from: () => 10,
    to: () => 2,
    number: (x) => x
  });
  const apiDecimalToBinary = get('https://api.tech/numbers/base', __);
  const roundValue = pipe(Number, round);
  const apiGetAnimal = async (id) => await get(`https://animals.tech/${id}`, '');

  const asyncPipe = pipeWith(
    (fn, res) => (res && res.then) 
    ? res.then(fn).catch((error) => {handleError(error)})
    : fn(res)
  );

  const processLogic = asyncPipe([
    string,
    roundValue,
    sideWriteLog,
    constructRequestParams,
    apiDecimalToBinary,
    getResultProp,
    sideWriteLog,
    length,
    sideWriteLog,
    sqr,
    sideWriteLog,
    mathMod3,
    sideWriteLog,
    apiGetAnimal,
    getResultProp,
    handleSuccess
  ]);

  const inputNotValid = validationLogic(obj);

  if (inputNotValid) {
    handleError('ValidationError');
    return;
  };

  processLogic(obj);
}

export default processSequence;
