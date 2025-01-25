namespace LibAcct.App;

public interface IEntity {
    int Id { get; set; }
    //Guid ReferenceId { get; } // TODO: frontend and JWT compatibility
}