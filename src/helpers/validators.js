/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const { 
  propEq,
  allPass,
  props,
  equals,
  compose,
  filter,
  length,
  partial,
  partialRight,
  gt,
  values,
  converge,
  reject,
  prop,
  not,
  __,
  none,
  uniq,
  lte,
  gte
} = require('ramda');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (obj) => {
  const starIsRed = propEq('star', 'red');
  const squareIsGreed = propEq('square', 'green');
  const triangleIsWhite = propEq('triangle', 'white');
  const circleIsWhite = propEq('circle', 'white');

  const validate = allPass([
    starIsRed,
    squareIsGreed,
    triangleIsWhite,
    circleIsWhite
  ]);

  return validate(obj);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (obj) => {
  const isGreen = equals('green');
  const filterGreen = partial(filter, [isGreen]);
  const allColors = props(['star', 'square', 'triangle', 'circle']);
  const greaterThanTwo = partialRight(gt, [1]);

  const validate = compose(
    greaterThanTwo,
    length,
    filterGreen,
    allColors
  );

  return validate(obj);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (obj) => {
  const isRed = equals('red');
  const filterRed = filter(isRed, __);
  const isBlue = equals('blue');
  const filterBlue = filter(isBlue, __);

  const numOfRed = compose(
    length,
    filterRed,
    values
  );

  const numOfBlue = compose(
    length,
    filterBlue,
    values
  )

  const validate = converge(equals, [numOfRed, numOfBlue])

  return validate(obj);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (obj) => {
  const circleIsBlue = propEq('circle', 'blue');
  const starIsRed = propEq('star', 'red');
  const squareIsOrange = propEq('square', 'orange');

  const validate = allPass([
    circleIsBlue,
    starIsRed,
    squareIsOrange
  ]);

  return validate(obj);
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (obj) => {
  const isWhite = equals('white');
  const filterNotWhite = reject(isWhite, __);
  const lte2 = lte(__, 2);
  const gte3 = gte(__, 3);

  const checkThreeEquals = compose(
    lte2,
    length,
    uniq,
    values
  );

  const checkEqualsNotWhite = compose(
    gte3,
    length,
    filterNotWhite,
    values
  );

  const validate = allPass([checkThreeEquals, checkEqualsNotWhite]);

  return validate(obj);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (obj) => {
  const triangleIsGreen = propEq('triangle', 'green');
  const isGreen = equals('green');
  const isRed = equals('red');
  const filterGreen = filter(isGreen, __);
  const filterRed = filter(isRed, __);
  const gte2 = gte(__, 2);
  const gte1 = gte(__, 1);

  const checkTwoGreen = compose(
    gte2,
    length,
    filterGreen,
    values,
  );
  
  const checkOneRed = compose(
    gte1,
    length,
    filterRed,
    values
  );

  const validate = allPass([triangleIsGreen, checkTwoGreen, checkOneRed]);

  return validate(obj);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (obj) => {
  const isOrange = equals('orange');
  const filterNotOrange = reject(isOrange, __);
  const eq0 = equals(__, 0);

  const validate = compose(
    eq0,
    length,
    filterNotOrange,
    values
  );
  
  return validate(obj);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (obj) => {
  const star = prop('star');
  const isRed = equals('red');
  const isWhite = equals('white');

  const isStarNotRed = compose(
    not,
    isRed,
    star
  );

  const isStarNotWhite = compose(
    not,
    isWhite,
    star
  );

  const validate = allPass([isStarNotRed, isStarNotWhite])

  return validate(obj);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (obj) => {
  const isGreen = equals('green');
  const filterNotGreen = reject(isGreen, __);
  const eq0 = equals(__, 0);

  const validate = compose(
    eq0,
    length,
    filterNotGreen,
    values
  );
  
  return validate(obj);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (obj) => {
  const figures = props(['triangle', 'square']);
  const isWhite = equals('white');
  const eq1 = equals(__, 1);
  const figuresAreNotWhite = none(isWhite);
  const figuresAreEqual = compose(
    eq1,
    length,
    uniq,
  );

  const checkConditions = allPass([figuresAreNotWhite, figuresAreEqual]);

  const validate = compose(
    checkConditions,
    figures
  );

  return validate(obj);
};
