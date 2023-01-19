import { useState, useEffect } from 'react'
import services from "./components/persons"

const Message = ({ message }) => {
  if (message === null) {
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
};

const PersonForm = ( props ) => (
  <form onSubmit={props.AddPerson}>
    <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
        <button type="submit"> add </button>
    </div>
  </form>
  );

const PersonList = (props) => {
  return (
    <ol>
      {props.persons.map(item => 
        <li key={item.id}>
          {item.name} {item.number}    
          <button onClick={props.removePerson(item.id)}> delete </button>
        </li>)}
    </ol>
  )
};

const Filter = (props) => {
  const filteredResult = props.persons.filter(item => item.name.toUpperCase().indexOf(props.searchText.toUpperCase()) !== -1);
  return (
    <div>
      filter shown with <input value={props.searchText} onChange={props.handlesearchText} />
      <br />
      {filteredResult.map(item => <p key={item.id}> {item.name} {item.number}</p>)}
    </div>
  )
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [searchText, setsearchText] = useState("");
  const [message, setMessage] = useState("")

  // get all persons
  useEffect(() => {
    services
    .getAll()
    .then(response => {
      setPersons(response.data);
    });
  }, []);

  const handlesearchText = (event) => {
    setsearchText(event.target.value);
  };

  const AddPerson = (event) => {
    event.preventDefault();
    if (persons.map(item => item.name).includes(newName)) {
      // alert(`${newName} is already added to phonebook`);
      setMessage(`'${newName}' is already added to phonebook`)
    } else {
      const newObj = {
        name : newName,
        number : newNumber
      };
      services
      .create(newObj)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setnewNumber('');

        setMessage(`Added '${newObj.name}'`);
        setTimeout(()=>{
          setMessage(null)
        }, 5000 );
      });
    };
  };

  const handleNameChange = (event) => {
    try{
      setNewName(event.target.value);
    }catch (e) {
      console.log("Something went wrong: ", e);
    }
  };

  const handleNumberChange = (event) => {
    try {
      setnewNumber(event.target.value);
    }catch (e){
      console.log("Something went wrong: ", e);
    }
  };

  const removePerson = (id) => () => {
    const rmName = persons.find(n => n.id === id).name;
    if (window.confirm(`Delete ${rmName} ?`)) {
      services
      .remove(id)
      .then(response => {
        // console.log(`已删除 ${id}`);
        // alert(`${rmName} is already removed`);
        
        services
        .getAll()
        .then(response => {
          setPersons(response.data);
        });

        setMessage(`'${rmName}' is already removed`);
        setTimeout(()=>{
          setMessage("")
        },5000 );
      })
    };
  };

  return (
    <div>
    <h2>Phonebook</h2>
    <Message
      message={message} />

    <Filter 
      persons={persons} 
      searchText={searchText}
      handlesearchText={handlesearchText} />

    <h3>Add a new</h3>
    <PersonForm
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber} 
      handleNumberChange={handleNumberChange}
      AddPerson={AddPerson} />

    <h3>Numbers</h3>
    <PersonList 
      persons={persons}
      removePerson={removePerson} />

    </div>
  )
  }

export default App