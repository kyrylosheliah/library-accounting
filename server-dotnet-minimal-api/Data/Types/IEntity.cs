namespace LibAcct.Data.Types;

public interface IEntity {
    int Id { get; }
    //Guid ReferenceId { get; } // TODO: frontend and JWT compatibility
}