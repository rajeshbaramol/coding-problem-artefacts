let family = [];
let commandsArrry = require('./RelationCommands');
let loop = [];
//'ADD_CHILD;Queen Anga;Chit;Male'

const filterFn = (...args) =>
  family.filter(
    (person) => person[args[0]] === args[1] && person[args[2]] === args[3]
  );

function addFamily(params) {
  let gender = params[params.length - 1];
  let name = params[params.length - 2];
  let parent = params.length > 3 ? params[params.length - 3] : '';
  if (params[0] === 'ADD_FAMILY_HEAD') {
    family.push({ gender, name, parent });
    loop.push(params[0] + '_SUCCEEDED');
  } else if (params[0] === 'ADD_CHILD') {
    family.push({ gender, name, parent });
    loop.push(params[0] + '_SUCCEEDED');
  } else if (params[0] === 'ADD_SPOUSE') {
    family.push({ gender, name, spouse: parent });
    loop.push(params[0] + '_SUCCEEDED');
  } else loop.push(params[0] + '_FAILED');
}
commandsArrry.forEach((x) => {
  if (x.startsWith('ADD')) addFamily(x.split(' '));
  else if (x.startsWith('GET')) loop.push(getRelationship(x.split(' ')));
});
function getRelationship(item) {
  let result = [];
  let relation = item[item.length - 1];
  let name = item[item.length - 2];
  let person = family.filter((x) => x.name == name);
  if (person.length === 0) {
    return 'PERSON_NOT_FOUND';
  }
  person = person[0];

  // to understated the flow i have not used curry otherwise we'll get the result in one line//....
  if (relation === 'Maternal-Aunt') {
    let mother = filterFn('name', person.parent, 'gender', 'Female');
    result = filterFn('name', mother[0].parent, 'gender', 'Male');
  }
  if (relation === 'Paternal-Uncle') {
    let mother = filterFn('name', person.parent, 'gender', 'Female');
    let father = filterFn('name', mother[0].spouse);
    result = filterFn('name', father[0].parent, 'gender', 'Male');
    loop.push(faBros);
  }
  if (relation === 'Maternal-Uncle') {
    let mother = filterFn('name', person.parent, 'gender', 'Female');
    let motherMom = filterFn('name', mother[0].parent);
    result = filterFn('parent', motherMom[0].name, 'gender', 'Male');
  }
  if (relation === 'Sister-In-Law' || relation === 'Brother-In-Law') {
    let spouseparent = filterFn('name', person.spouse);
    result = filterFn(
      'parent',
      spouseparent[0].parent,
      'gender',
      relation === 'Brother-In-Law' ? 'Male' : 'Female'
    );
  }
  if (relation === 'Son' || relation === 'Daughter') {
    result = filterFn(
      'parent',
      person.name,
      'gender',
      relation === 'Son' ? 'Male' : 'Female'
    );
  }
  if (relation === 'Siblings') {
    result = filterFn('parent', person.name);
  }

  return result.map((x) => x.name).join();
}


//   we may go with function curry if any need further code reduction
//   function curry(fn) {
//     return function curried(...args) {
//       if (args.length >= fn.length) {
//         return fn.apply(this, args);
//       } else {
//         return function (...args2) {
//           return curried(this, ...args2);
//         };
//       }
//     };
//   }
loop.forEach((x) => {
  console.log(x);
});
