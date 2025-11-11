using TUConnect.Mobile.ViewModels;

namespace TUConnect.Mobile.Views;

public partial class FishingLogPage : ContentPage
{
    public FishingLogPage(FishingLogViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is FishingLogViewModel vm)
        {
            vm.LoadLogsCommand.Execute(null);
        }
    }
}
