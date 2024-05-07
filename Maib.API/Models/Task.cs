using System;
using System.ComponentModel.DataAnnotations;

namespace Maib.API.Models
{
    public class Task
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(100, ErrorMessage = "Title must be less than 100 characters")]
        public string Title { get; set; }

        [MaxLength(500, ErrorMessage = "Description must be less than 500 characters")]
        public string Description { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Priority must be a positive number")]
        public int Priority { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("новая|в процессе|завершена", ErrorMessage = "Status must be 'новая', 'в процессе' or 'завершена'")]
        public string Status { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }
    }
}