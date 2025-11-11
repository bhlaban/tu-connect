using TUConnect.Mobile.ViewModels;

namespace TUConnect.Mobile.Views;

public partial class VolunteerTimePage : ContentPage
{
    public VolunteerTimePage(VolunteerTimeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is VolunteerTimeViewModel vm)
        {
            vm.LoadEntriesCommand.Execute(null);
        }
    }
}
